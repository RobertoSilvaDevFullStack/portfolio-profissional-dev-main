import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Edit, Trash2 } from 'lucide-react';
import CommentForm from './CommentForm';
import { showError, showSuccess } from '@/utils/toast';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

export interface CommentType {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  user_id: string;
  comment_likes: { user_id: string }[];
  replies: CommentType[];
}

interface CommentProps {
  comment: CommentType;
  onCommentAdded: () => void;
}

const Comment = ({ comment, onCommentAdded }: CommentProps) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const userHasLiked = user && comment.comment_likes.some(like => like.user_id === user.id);
  const isAuthor = user && user.id === comment.user_id;

  const handleLike = async () => {
    if (!user) return showError('Você precisa estar logado para curtir.');
    
    if (userHasLiked) {
      await supabase.from('comment_likes').delete().match({ comment_id: comment.id, user_id: user.id });
    } else {
      await supabase.from('comment_likes').insert({ comment_id: comment.id, user_id: user.id });
    }
    onCommentAdded(); // Re-fetch comments to update like count
  };

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    const { error } = await supabase.from('comments').update({ content: editedContent }).eq('id', comment.id);
    if (error) {
      showError('Erro ao atualizar comentário.');
    } else {
      showSuccess('Comentário atualizado.');
      setIsEditing(false);
      onCommentAdded();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('comments').delete().eq('id', comment.id);
    if (error) {
      showError('Erro ao excluir comentário.');
    } else {
      showSuccess('Comentário excluído.');
      onCommentAdded();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={comment.profiles.avatar_url} alt={comment.profiles.full_name} />
        <AvatarFallback>{comment.profiles.full_name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-800/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-light-cyan">{comment.profiles.full_name}</p>
            <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <CommentForm postId={comment.post_id} onCommentAdded={handleUpdate} onCancel={() => setIsEditing(false)} />
            </div>
          ) : (
            <p className="text-gray-300 mt-2 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <Button variant="ghost" size="sm" onClick={handleLike} className={`flex items-center gap-1 ${userHasLiked ? 'text-light-cyan' : ''}`}>
            <ThumbsUp size={16} /> {comment.comment_likes.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1">
            <MessageSquare size={16} /> Responder
          </Button>
          {isAuthor && !isEditing && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
                <Edit size={16} /> Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="flex items-center gap-1 text-red-400 hover:text-red-300">
                <Trash2 size={16} /> Excluir
              </Button>
            </>
          )}
        </div>
        {isReplying && (
          <div className="mt-4">
            <CommentForm postId={comment.post_id} parentId={comment.id} onCommentAdded={onCommentAdded} onCancel={() => setIsReplying(false)} />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-700">
            {comment.replies.map(reply => (
              <Comment key={reply.id} comment={reply} onCommentAdded={onCommentAdded} />
            ))}
          </div>
        )}
      </div>
      <DeleteConfirmationDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDelete} itemName="seu comentário" />
    </div>
  );
};

export default Comment;