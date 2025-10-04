import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Download,
  Upload,
  FileText,
  Briefcase,
  MessageSquare,
  Package,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "@/utils/toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BackupItem {
  table: string;
  count: number;
  lastBackup?: string;
}

const Backup = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BackupItem[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("");

  // Buscar estatísticas das tabelas
  const fetchStats = async () => {
    try {
      const [
        { count: postsCount },
        { count: projectsCount },
        { count: leadsCount },
        { count: commentsCount },
      ] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
      ]);

      setStats([
        { table: "posts", count: postsCount || 0 },
        { table: "projects", count: projectsCount || 0 },
        { table: "leads", count: leadsCount || 0 },
        { table: "comments", count: commentsCount || 0 },
      ]);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  // Exportar dados de uma tabela específica
  const exportTable = async (tableName: string) => {
    setLoading(true);
    const loadingToast = showLoading(`Exportando ${tableName}...`);

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_${tableName}_${format(
        new Date(),
        "yyyy-MM-dd_HH-mm"
      )}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dismissToast(loadingToast);
      showSuccess(`${tableName} exportado com sucesso!`);
    } catch (error) {
      console.error("Erro na exportação:", error);
      dismissToast(loadingToast);
      showError("Erro ao exportar dados");
    } finally {
      setLoading(false);
    }
  };

  // Exportar todos os dados
  const exportAll = async () => {
    setLoading(true);
    const loadingToast = showLoading("Exportando todos os dados...");

    try {
      const [
        { data: posts },
        { data: projects },
        { data: leads },
        { data: comments },
        { data: siteContent },
      ] = await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("site_content").select("*"),
      ]);

      const backup = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: {
          posts: posts || [],
          projects: projects || [],
          leads: leads || [],
          comments: comments || [],
          site_content: siteContent || [],
        },
      };

      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_completo_${format(
        new Date(),
        "yyyy-MM-dd_HH-mm"
      )}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dismissToast(loadingToast);
      showSuccess("Backup completo criado com sucesso!");
    } catch (error) {
      console.error("Erro no backup completo:", error);
      dismissToast(loadingToast);
      showError("Erro ao criar backup completo");
    } finally {
      setLoading(false);
    }
  };

  // Importar dados
  const handleImport = async () => {
    if (!importFile) {
      showError("Selecione um arquivo para importar");
      return;
    }

    setLoading(true);
    const loadingToast = showLoading("Importando dados...");

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);

      // Verificar se é um backup completo ou de tabela única
      const tableName = importType;
      let records = data;

      if (data.version && data.data) {
        // Backup completo
        if (!importType || importType === "all") {
          // Importar todas as tabelas
          const tables = Object.keys(data.data);
          for (const table of tables) {
            if (table !== "site_content") {
              const { error } = await supabase
                .from(table)
                .insert(data.data[table]);
              if (error) throw error;
            }
          }
          dismissToast(loadingToast);
          showSuccess("Dados importados com sucesso!");
        } else {
          // Importar tabela específica do backup completo
          records = data.data[importType];
          if (!records || records.length === 0) {
            throw new Error(`Nenhum dado encontrado para ${importType}`);
          }
          const { error } = await supabase.from(importType).insert(records);
          if (error) throw error;
          dismissToast(loadingToast);
          showSuccess(`${importType} importado com sucesso!`);
        }
      } else {
        // Backup de tabela única
        if (!Array.isArray(records)) {
          throw new Error("Formato de arquivo inválido");
        }
        const { error } = await supabase.from(tableName).insert(records);
        if (error) throw error;
        dismissToast(loadingToast);
        showSuccess(`${tableName} importado com sucesso!`);
      }

      setShowImportDialog(false);
      setImportFile(null);
      fetchStats();
    } catch (error) {
      console.error("Erro na importação:", error);
      dismissToast(loadingToast);
      showError("Erro ao importar dados: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Abrir diálogo de importação
  const openImportDialog = (type: string) => {
    setImportType(type);
    setShowImportDialog(true);
  };

  useState(() => {
    fetchStats();
  });

  const getIcon = (table: string) => {
    switch (table) {
      case "posts":
        return <FileText className="h-5 w-5 text-blue-400" />;
      case "projects":
        return <Briefcase className="h-5 w-5 text-purple-400" />;
      case "leads":
        return <MessageSquare className="h-5 w-5 text-green-400" />;
      case "comments":
        return <MessageSquare className="h-5 w-5 text-yellow-400" />;
      default:
        return <Database className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTableLabel = (table: string) => {
    const labels: Record<string, string> = {
      posts: "Posts do Blog",
      projects: "Projetos",
      leads: "Leads",
      comments: "Comentários",
    };
    return labels[table] || table;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Backup e Restauração
        </h1>
        <p className="text-gray-400">
          Exporte e importe seus dados de forma segura
        </p>
      </div>

      {/* Alerta de segurança */}
      <Alert className="bg-yellow-900/20 border-yellow-600">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-200">
          <strong>Atenção:</strong> Ao importar dados, você pode sobrescrever
          informações existentes. Sempre faça um backup antes de importar.
        </AlertDescription>
      </Alert>

      {/* Backup completo */}
      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5" />
            Backup Completo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-sm">
            Exporta todos os dados do sistema em um único arquivo JSON
          </p>
          <div className="flex gap-2">
            <Button
              onClick={exportAll}
              disabled={loading}
              className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Tudo
            </Button>
            <Button
              onClick={() => openImportDialog("all")}
              disabled={loading}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar Backup Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backups individuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((item) => (
          <Card key={item.table} className="bg-dark-navy/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(item.table)}
                  {getTableLabel(item.table)}
                </div>
                <Badge variant="outline" className="bg-gray-800">
                  {item.count} registros
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.lastBackup && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-3 w-3" />
                  Último backup:{" "}
                  {format(new Date(item.lastBackup), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => exportTable(item.table)}
                  disabled={loading || item.count === 0}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Exportar
                </Button>
                <Button
                  onClick={() => openImportDialog(item.table)}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-700"
                >
                  <Upload className="mr-2 h-3 w-3" />
                  Importar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diálogo de importação */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>
              Importar{" "}
              {importType === "all"
                ? "Backup Completo"
                : getTableLabel(importType)}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecione o arquivo JSON para importar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {importFile
                    ? importFile.name
                    : "Clique para selecionar um arquivo"}
                </span>
              </label>
            </div>

            <Alert className="bg-blue-900/20 border-blue-600">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200 text-sm">
                Os dados importados serão adicionados aos existentes. IDs
                duplicados serão ignorados.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImportDialog(false);
                setImportFile(null);
              }}
              className="border-gray-600 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importFile || loading}
              className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
            >
              {loading ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Backup;
