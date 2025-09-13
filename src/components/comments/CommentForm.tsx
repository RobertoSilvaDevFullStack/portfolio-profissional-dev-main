import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
}

const CommentForm = ({ postId, parentId, onCommentAdded, onCancel }: CommentFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      parent_id: parentId,
      content: content.trim(),
    });

    if (error) {
      showError('Erro ao enviar comentário.');
      console.error(error);
    } else {
      showSuccess('Comentário adicionado!');
      setContent('');
      onCommentAdded();
      onCancel?.();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Escreva sua resposta..." : "Deixe seu comentário..."}
        className="bg-gray-800/30 border-gray-600 text-white"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" disabled={loading || !content.trim()} className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {parentId ? 'Responder' : 'Comentar'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;