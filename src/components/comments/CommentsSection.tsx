import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import CommentForm from './CommentForm';
import Comment, { CommentType } from './Comment';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { user, session } = useAuth();
  const location = useLocation();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (full_name, avatar_url),
        comment_likes (user_id)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } else {
      // Estrutura os comentários em threads (aninhados)
      const commentsById: { [key: string]: CommentType & { replies: CommentType[] } } = {};
      data.forEach(comment => {
        commentsById[comment.id] = { ...comment, replies: [] };
      });

      const threadedComments: CommentType[] = [];
      data.forEach(comment => {
        if (comment.parent_id && commentsById[comment.parent_id]) {
          commentsById[comment.parent_id].replies.push(commentsById[comment.id]);
        } else {
          threadedComments.push(commentsById[comment.id]);
        }
      });
      setComments(threadedComments);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-16 pt-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">{comments.length} Comentário(s)</h2>
      
      <div className="space-y-8">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          comments.map(comment => (
            <Comment key={comment.id} comment={comment} onCommentAdded={fetchComments} />
          ))
        )}
      </div>

      <div className="mt-12">
        {session ? (
          <CommentForm postId={postId} onCommentAdded={fetchComments} />
        ) : (
          <div className="text-center bg-gray-800/20 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">Faça login para deixar um comentário.</p>
            <Button asChild className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90">
              <Link to="/login" state={{ from: location }}>Login com Google</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;