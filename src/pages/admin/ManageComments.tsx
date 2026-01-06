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
import { MessageSquare, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { showSuccess, showError } from "@/utils/toast";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  postId: string;
  createdAt: string;
  status?: "pending" | "approved" | "spam";
  post?: {
    title: string;
  };
}

const ManageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Note: This would need a backend endpoint that gets all comments
      // For now, we'll use a placeholder
      const { data } = await api.posts.list();
      const posts = data.posts || [];

      // Fetch comments for each post
      const allComments: Comment[] = [];
      for (const post of posts) {
        try {
          const { data: commentsData } = await api.comments.getByPost(post.id);
          const commentsWithPost = (commentsData.comments || []).map((comment: any) => ({
            ...comment,
            post: { title: post.title },
          }));
          allComments.push(...commentsWithPost);
        } catch (error) {
          console.error(`Error fetching comments for post ${post.id}:`, error);
        }
      }

      setComments(allComments);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      showError("Erro ao carregar comentários");
    } finally {
      setLoading(false);
    }
  };

  const handleModerateComment = async (id: string, status: "approved" | "spam") => {
    try {
      await api.comments.moderate(id, { status });
      setComments(comments.map(c => c.id === id ? { ...c, status } : c));
      showSuccess(`Comentário ${status === "approved" ? "aprovado" : "marcado como spam"}!`);
    } catch (error) {
      console.error("Erro ao moderar comentário:", error);
      showError("Erro ao moderar comentário");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await api.comments.delete(id);
      setComments(comments.filter((comment) => comment.id !== id));
      showSuccess("Comentário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      showError("Erro ao excluir comentário");
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setCommentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-yellow-500" },
      approved: { label: "Aprovado", className: "bg-green-500" },
      spam: { label: "Spam", className: "bg-red-500" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredComments =
    filterStatus === "all"
      ? comments
      : comments.filter((comment) => (comment.status || "pending") === filterStatus);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Comentários</h1>
          <p className="text-gray-400 mt-2">
            Total de {comments.length}{" "}
            {comments.length === 1 ? "comentário" : "comentários"}
          </p>
        </div>
      </div>

      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Lista de Comentários
            </CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {filterStatus === "all"
                  ? "Nenhum comentário encontrado."
                  : "Nenhum comentário encontrado com este filtro."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-white">Autor</TableHead>
                  <TableHead className="text-white">Comentário</TableHead>
                  <TableHead className="text-white">Post</TableHead>
                  <TableHead className="text-white">Data</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment) => (
                  <TableRow
                    key={comment.id}
                    className="border-gray-700 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-gray-300">
                      <div>
                        <p className="font-medium">{comment.authorName}</p>
                        <p className="text-sm text-gray-500">{comment.authorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-md">
                      <p className="truncate">{comment.content}</p>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {comment.post?.title || "Post não encontrado"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {format(parseISO(comment.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(comment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {comment.status !== "approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModerateComment(comment.id, "approved")}
                            className="text-green-400 hover:text-green-400 hover:bg-gray-700"
                            title="Aprovar"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {comment.status !== "spam" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModerateComment(comment.id, "spam")}
                            className="text-orange-400 hover:text-orange-400 hover:bg-gray-700"
                            title="Marcar como spam"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(comment.id)}
                          className="text-red-400 hover:text-red-400 hover:bg-gray-700"
                          title="Excluir"
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

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={() => commentToDelete && handleDeleteComment(commentToDelete)}
        itemName="comentário"
      />
    </div>
  );
};

export default ManageComments;
