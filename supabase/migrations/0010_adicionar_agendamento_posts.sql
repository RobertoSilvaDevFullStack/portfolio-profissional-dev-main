-- Adicionar campos de agendamento e status nos posts
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Atualizar posts existentes para status 'published' se já estão visíveis
UPDATE posts 
SET status = 'published', published_at = created_at 
WHERE status IS NULL OR status = 'draft';

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC) WHERE status = 'published';

-- Criar view para posts agendados que devem ser publicados
CREATE OR REPLACE VIEW posts_ready_to_publish AS
SELECT *
FROM posts
WHERE status = 'scheduled'
  AND scheduled_at <= NOW()
ORDER BY scheduled_at ASC;

-- Criar função para publicar posts agendados
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS TABLE(
  published_count INTEGER,
  published_ids UUID[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_published_count INTEGER := 0;
  v_published_ids UUID[] := ARRAY[]::UUID[];
  v_post RECORD;
BEGIN
  -- Atualizar posts que devem ser publicados
  FOR v_post IN
    SELECT id FROM posts
    WHERE status = 'scheduled'
      AND scheduled_at <= NOW()
  LOOP
    UPDATE posts
    SET status = 'published',
        published_at = NOW()
    WHERE id = v_post.id;
    
    v_published_count := v_published_count + 1;
    v_published_ids := array_append(v_published_ids, v_post.id);
    
    -- Criar notificação para o autor
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT 
      p.author_id,
      'post',
      'Post publicado!',
      'O post "' || p.title || '" foi publicado automaticamente.',
      '/blog/' || p.slug
    FROM posts p
    WHERE p.id = v_post.id;
  END LOOP;
  
  RETURN QUERY SELECT v_published_count, v_published_ids;
END;
$$;

-- Comentários
COMMENT ON COLUMN posts.status IS 'Status do post: draft (rascunho), scheduled (agendado), published (publicado), archived (arquivado)';
COMMENT ON COLUMN posts.scheduled_at IS 'Data e hora programada para publicação automática';
COMMENT ON COLUMN posts.published_at IS 'Data e hora real de publicação';
COMMENT ON FUNCTION publish_scheduled_posts() IS 'Função para publicar automaticamente posts agendados';

-- Criar trigger para definir published_at quando status mudar para published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_published_at
BEFORE UPDATE OF status ON posts
FOR EACH ROW
EXECUTE FUNCTION set_published_at();
