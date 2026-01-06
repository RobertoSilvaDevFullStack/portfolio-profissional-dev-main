import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
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
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Trash2,
  ExternalLink,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { showSuccess, showError } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import { Label } from "@/components/ui/label";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status?: "new" | "contacted" | "qualified" | "converted";
}

const ManageLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.leads.list();
      setLeads(data.leads || []);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      showError("Erro ao carregar leads");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await api.leads.delete(id);
      setLeads(leads.filter((lead) => lead.id !== id));
      showSuccess("Lead excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
      showError("Erro ao excluir lead");
    } finally {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setLeadToDelete(id);
    setDeleteDialogOpen(true);
  };

  const viewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Email", "Telefone", "Mensagem", "Data"];
    const csvData = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.message,
      format(parseISO(lead.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    showSuccess("Arquivo CSV exportado com sucesso!");
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      new: { label: "Novo", className: "bg-blue-500" },
      contacted: { label: "Contatado", className: "bg-yellow-500" },
      qualified: { label: "Qualificado", className: "bg-green-500" },
      converted: { label: "Convertido", className: "bg-purple-500" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => (lead.status || "new") === filterStatus);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Leads</h1>
          <p className="text-gray-400 mt-2">
            Total de {leads.length}{" "}
            {leads.length === 1 ? "lead cadastrado" : "leads cadastrados"}
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="border-gray-600 hover:bg-gray-700 text-white"
          disabled={leads.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Lista de Leads
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Novos</SelectItem>
                  <SelectItem value="contacted">Contatados</SelectItem>
                  <SelectItem value="qualified">Qualificados</SelectItem>
                  <SelectItem value="converted">Convertidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {filterStatus === "all"
                  ? "Nenhum lead cadastrado ainda."
                  : "Nenhum lead encontrado com este filtro."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Telefone</TableHead>
                  <TableHead className="text-white">Data</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="border-gray-700 hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-light-cyan"
                        >
                          {lead.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-light-cyan"
                        >
                          {lead.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {format(parseISO(lead.createdAt), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewLeadDetails(lead)}
                          className="text-light-cyan hover:text-light-cyan hover:bg-gray-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(lead.id)}
                          className="text-red-400 hover:text-red-400 hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Lead */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalhes do Lead
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações completas do contato
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm">Nome</Label>
                  <p className="text-white font-medium mt-1">
                    {selectedLead.name}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">
                    Data de Cadastro
                  </Label>
                  <p className="text-white font-medium mt-1">
                    {format(
                      parseISO(selectedLead.createdAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm">Email</Label>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-light-cyan font-medium mt-1 block hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Telefone</Label>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-light-cyan font-medium mt-1 block hover:underline"
                  >
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Mensagem</Label>
                <div className="bg-gray-900 p-4 rounded-lg mt-1">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-light-cyan text-dark-navy hover:bg-light-cyan/90"
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.email}?subject=Re: Contato via Portfolio&body=Olá ${selectedLead.name},%0D%0A%0D%0A`;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Email
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-700 text-white"
                  onClick={() => {
                    window.location.href = `https://wa.me/${selectedLead.phone.replace(
                      /\\D/g,
                      ""
                    )}`;
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setLeadToDelete(null);
        }}
        onConfirm={() => leadToDelete && handleDeleteLead(leadToDelete)}
        itemName="lead"
      />
    </div>
  );
};

export default ManageLeads;
