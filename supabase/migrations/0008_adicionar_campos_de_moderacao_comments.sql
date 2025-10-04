-- Adicionar campos de moderação na tabela comments
-- Execute este script no SQL Editor do Supabase

-- Adicionar colunas de moderação
DO $$ 
BEGIN
  -- Campo de status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.comments 
    ADD COLUMN status TEXT DEFAULT 'approved' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam'));
  END IF;

  -- Campo de moderador
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'moderated_by'
  ) THEN
    ALTER TABLE public.comments 
    ADD COLUMN moderated_by UUID REFERENCES auth.users(id);
  END IF;

  -- Campo de data de moderação
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'moderated_at'
  ) THEN
    ALTER TABLE public.comments 
    ADD COLUMN moderated_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Campo de motivo de rejeição
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE public.comments 
    ADD COLUMN rejection_reason TEXT;
  END IF;
END $$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS comments_status_idx ON public.comments(status);
CREATE INDEX IF NOT EXISTS comments_post_id_status_idx ON public.comments(post_id, status);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);

-- Atualizar comentários existentes para status 'approved'
UPDATE public.comments SET status = 'approved' WHERE status IS NULL;

-- Criar view para estatísticas de comentários
CREATE OR REPLACE VIEW public.comment_moderation_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
  COUNT(*) FILTER (WHERE status = 'spam') as spam_count,
  COUNT(*) as total_count,
  MAX(created_at) as last_comment_at
FROM public.comments;

-- Adicionar política para admins poderem moderar
CREATE POLICY "Admins can manage all comments" 
ON public.comments 
FOR ALL 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN (
      SELECT email FROM profiles WHERE role = 'admin'
    )
  )
);

-- Verificar se as colunas foram criadas corretamente
SELECT 
  'Coluna status criada: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'status'
  ) THEN '✅' ELSE '❌' END as status_status,
  
  'Coluna moderated_by criada: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'moderated_by'
  ) THEN '✅' ELSE '❌' END as status_moderated_by,
  
  'View criada: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_name = 'comment_moderation_stats'
  ) THEN '✅' ELSE '❌' END as status_view;
