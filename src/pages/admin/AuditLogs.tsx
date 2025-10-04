import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Briefcase,
  MessageSquare,
  User,
  Database,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  LogIn,
  LogOut,
  Search,
  Filter,
  Calendar,
  Eye,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  entity_title?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, searchTerm, actionFilter, entityFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entity_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de ação
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Filtro de entidade
    if (entityFilter !== "all") {
      filtered = filtered.filter((log) => log.entity_type === entityFilter);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, JSX.Element> = {
      create: <Plus className="h-4 w-4 text-green-400" />,
      update: <Edit className="h-4 w-4 text-blue-400" />,
      delete: <Trash2 className="h-4 w-4 text-red-400" />,
      export: <Download className="h-4 w-4 text-purple-400" />,
      import: <Upload className="h-4 w-4 text-yellow-400" />,
      login: <LogIn className="h-4 w-4 text-green-400" />,
      logout: <LogOut className="h-4 w-4 text-gray-400" />,
    };
    return icons[action] || <FileText className="h-4 w-4 text-gray-400" />;
  };

  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, JSX.Element> = {
      post: <FileText className="h-4 w-4 text-blue-400" />,
      project: <Briefcase className="h-4 w-4 text-purple-400" />,
      lead: <MessageSquare className="h-4 w-4 text-green-400" />,
      comment: <MessageSquare className="h-4 w-4 text-yellow-400" />,
      user: <User className="h-4 w-4 text-pink-400" />,
      backup: <Database className="h-4 w-4 text-orange-400" />,
    };
    return icons[entityType] || <FileText className="h-4 w-4 text-gray-400" />;
  };

  const getActionBadge = (action: string) => {
    const config: Record<string, { label: string; className: string }> = {
      create: { label: "Criar", className: "bg-green-500" },
      update: { label: "Atualizar", className: "bg-blue-500" },
      delete: { label: "Excluir", className: "bg-red-500" },
      export: { label: "Exportar", className: "bg-purple-500" },
      import: { label: "Importar", className: "bg-yellow-500" },
      login: { label: "Login", className: "bg-green-600" },
      logout: { label: "Logout", className: "bg-gray-500" },
    };
    const badge = config[action] || { label: action, className: "bg-gray-500" };
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      post: "Post",
      project: "Projeto",
      lead: "Lead",
      comment: "Comentário",
      user: "Usuário",
      backup: "Backup",
    };
    return labels[entityType] || entityType;
  };

  const openDetailsDialog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailsDialog(true);
  };

  const exportLogs = () => {
    const jsonString = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_logs_${format(new Date(), "yyyy-MM-dd_HH-mm")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Logs de Auditoria
          </h1>
          <p className="text-gray-400">
            Histórico completo de ações administrativas
          </p>
        </div>
        <Button
          onClick={exportLogs}
          variant="outline"
          className="border-gray-600 hover:bg-gray-700"
          disabled={filteredLogs.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Logs ({filteredLogs.length})
        </Button>
      </div>

      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por usuário, título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="create">Criar</SelectItem>
                <SelectItem value="update">Atualizar</SelectItem>
                <SelectItem value="delete">Excluir</SelectItem>
                <SelectItem value="export">Exportar</SelectItem>
                <SelectItem value="import">Importar</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="project">Projetos</SelectItem>
                <SelectItem value="lead">Leads</SelectItem>
                <SelectItem value="comment">Comentários</SelectItem>
                <SelectItem value="backup">Backups</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Histórico de Ações ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm || actionFilter !== "all" || entityFilter !== "all"
                  ? "Nenhum log encontrado com esses filtros"
                  : "Nenhum log de auditoria registrado ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-white">Data/Hora</TableHead>
                    <TableHead className="text-white">Usuário</TableHead>
                    <TableHead className="text-white">Ação</TableHead>
                    <TableHead className="text-white">Tipo</TableHead>
                    <TableHead className="text-white">Entidade</TableHead>
                    <TableHead className="text-right text-white">
                      Detalhes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="border-gray-700 hover:bg-gray-800/50"
                    >
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {format(
                          parseISO(log.created_at),
                          "dd/MM/yyyy HH:mm:ss",
                          { locale: ptBR }
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.user_email || "Sistema"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEntityIcon(log.entity_type)}
                          <span className="text-gray-300">
                            {getEntityLabel(log.entity_type)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.entity_title || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDetailsDialog(log)}
                          className="hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Log</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações completas da ação registrada
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Data/Hora</label>
                  <p className="text-white font-mono">
                    {format(
                      parseISO(selectedLog.created_at),
                      "dd/MM/yyyy HH:mm:ss",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Usuário</label>
                  <p className="text-white">
                    {selectedLog.user_email || "Sistema"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Ação</label>
                  <div className="mt-1">
                    {getActionBadge(selectedLog.action)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Tipo</label>
                  <p className="text-white">
                    {getEntityLabel(selectedLog.entity_type)}
                  </p>
                </div>
                {selectedLog.entity_title && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-400">Entidade</label>
                    <p className="text-white">{selectedLog.entity_title}</p>
                  </div>
                )}
                {selectedLog.ip_address && (
                  <div>
                    <label className="text-sm text-gray-400">IP</label>
                    <p className="text-white font-mono">
                      {selectedLog.ip_address}
                    </p>
                  </div>
                )}
                {selectedLog.entity_id && (
                  <div>
                    <label className="text-sm text-gray-400">ID</label>
                    <p className="text-white font-mono text-xs">
                      {selectedLog.entity_id}
                    </p>
                  </div>
                )}
              </div>

              {selectedLog.old_data && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Dados Anteriores
                  </label>
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-48 text-xs text-gray-300">
                    {JSON.stringify(selectedLog.old_data, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_data && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Dados Novos
                  </label>
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-48 text-xs text-gray-300">
                    {JSON.stringify(selectedLog.new_data, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.user_agent && (
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    User Agent
                  </label>
                  <p className="text-xs text-gray-400 bg-gray-900 p-3 rounded">
                    {selectedLog.user_agent}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
