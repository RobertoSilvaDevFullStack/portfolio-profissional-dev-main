import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Check,
  X,
  Ban,
  Eye,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showSuccess, showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  rejection_reason?: string;
  user_id: string;
  post_id: string;
  posts: {
    title: string;
    slug: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

const ManageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
  });

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          posts (title, slug),
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      showError('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('comment_moderation_stats')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setStats({
          pending: data.pending_count || 0,
          approved: data.approved_count || 0,
          rejected: data.rejected_count || 0,
          spam: data.spam_count || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const moderateComment = async (
    commentId: string,
    status: 'approved' | 'rejected' | 'spam',
    reason?: string
  ) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          status,
          moderated_at: new Date().toISOString(),
          rejection_reason: reason || null,
        })
        .eq('id', commentId);

      if (error) throw error;

      await fetchComments();
      await fetchStats();

      const messages = {
        approved: 'Comentário aprovado!',
        rejected: 'Comentário rejeitado!',
        spam: 'Comentário marcado como spam!',
      };

      showSuccess(messages[status]);
      setShowRejectDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Erro ao moderar comentário:', error);
      showError('Erro ao moderar comentário');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id);

      if (error) throw error;

      setComments(comments.filter(comment => comment.id !== id));
      await fetchStats();
      showSuccess('Comentário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      showError('Erro ao excluir comentário');
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const openRejectDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setShowRejectDialog(true);
  };

  const viewCommentDetails = (comment: Comment) => {
    setSelectedComment(comment);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-yellow-500' },
      approved: { label: 'Aprovado', className: 'bg-green-500' },
      rejected: { label: 'Rejeitado', className: 'bg-red-500' },
      spam: { label: 'Spam', className: 'bg-orange-500' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredComments = comments.filter(comment => {
    const matchesStatus = filterStatus === 'all' || comment.status === filterStatus;
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.posts?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Moderação de Comentários</h1>
          <p className="text-gray-400 mt-2">
            {stats.pending} {stats.pending === 1 ? 'comentário pendente' : 'comentários pendentes'}
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Aprovados</p>
                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Rejeitados</p>
                <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Spam</p>
                <p className="text-2xl font-bold text-orange-500">{stats.spam}</p>
              </div>
              <Ban className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-dark-navy/50 border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Lista de Comentários
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar comentários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="approved">Aprovados</SelectItem>
                    <SelectItem value="rejected">Rejeitados</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                {searchTerm || filterStatus !== 'all'
                  ? 'Nenhum comentário encontrado com este filtro.'
                  : 'Nenhum comentário ainda.'}
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
                  <TableRow key={comment.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-gray-300">
                      <div>
                        <p>{comment.profiles?.full_name || 'Usuário'}</p>
                        <p className="text-xs text-gray-500">{comment.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-md">
                      <p className="truncate">{comment.content}</p>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <a
                        href={`/blog/${comment.posts?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-light-cyan truncate block max-w-xs"
                      >
                        {comment.posts?.title}
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {format(parseISO(comment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(comment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewCommentDetails(comment)}
                          className="text-blue-400 hover:text-blue-400 hover:bg-gray-700"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {comment.status !== 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moderateComment(comment.id, 'approved')}
                            className="text-green-400 hover:text-green-400 hover:bg-gray-700"
                            title="Aprovar"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}

                        {comment.status !== 'rejected' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openRejectDialog(comment)}
                            className="text-red-400 hover:text-red-400 hover:bg-gray-700"
                            title="Rejeitar"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        {comment.status !== 'spam' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moderateComment(comment.id, 'spam')}
                            className="text-orange-400 hover:text-orange-400 hover:bg-gray-700"
                            title="Marcar como spam"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Comentário</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Autor</p>
                <p className="text-white font-medium">{selectedComment.profiles?.full_name}</p>
                <p className="text-sm text-gray-400">{selectedComment.profiles?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Post</p>
                <a
                  href={`/blog/${selectedComment.posts?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-cyan hover:underline"
                >
                  {selectedComment.posts?.title}
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-400">Comentário</p>
                <div className="bg-gray-900 p-4 rounded-lg mt-2">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedComment.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Data</p>
                  <p className="text-white">
                    {format(parseISO(selectedComment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  {getStatusBadge(selectedComment.status)}
                </div>
              </div>

              {selectedComment.rejection_reason && (
                <div>
                  <p className="text-sm text-gray-400">Motivo da Rejeição</p>
                  <p className="text-red-400">{selectedComment.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Rejeição */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Rejeitar Comentário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Por favor, informe o motivo da rejeição (opcional).
            </DialogDescription>
          </DialogHeader>
          <div>
            <Textarea
              placeholder="Motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedComment) {
                  moderateComment(selectedComment.id, 'rejected', rejectionReason);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Rejeitar Comentário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
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
