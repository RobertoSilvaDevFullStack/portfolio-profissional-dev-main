import { useState } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
}

const CommentForm = ({ postId, onCommentAdded, onCancel }: CommentFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // If authenticated, use user data, otherwise use form data
    const commentData = user
      ? {
        postId,
        content: content.trim(),
        authorName: user.fullName || user.email,
        authorEmail: user.email,
      }
      : {
        postId,
        content: content.trim(),
        authorName,
        authorEmail,
      };

    setLoading(true);
    try {
      await api.comments.create(commentData);
      showSuccess('Comentário enviado para moderação!');
      setContent('');
      setAuthorName('');
      setAuthorEmail('');
      onCommentAdded();
      onCancel?.();
    } catch (error) {
      showError('Erro ao enviar comentário.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!user && (
        <>
          <div>
            <Label htmlFor="authorName" className="text-gray-300">Nome</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Seu nome"
              required
              className="bg-gray-800/30 border-gray-600 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="authorEmail" className="text-gray-300">E-mail</Label>
            <Input
              id="authorEmail"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-gray-800/30 border-gray-600 text-white mt-1"
            />
          </div>
        </>
      )}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Deixe seu comentário..."
        className="bg-gray-800/30 border-gray-600 text-white"
        rows={3}
        required
      />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" disabled={loading || !content.trim()} className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Comentar
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;