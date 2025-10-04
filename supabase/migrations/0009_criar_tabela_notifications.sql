-- Criar a tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('lead', 'comment', 'goal', 'post', 'project', 'system')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  icon VARCHAR(50),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;

-- Ativar RLS (Row Level Security)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias notificações
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias notificações (marcar como lido)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Sistema pode inserir notificações
CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Política: Usuários podem deletar suas próprias notificações
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Criar função para limpar notificações antigas (mais de 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND read = TRUE;
END;
$$;

-- Criar view para estatísticas de notificações
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE read = FALSE) as unread_count,
  COUNT(*) FILTER (WHERE read = TRUE) as read_count,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE type = 'lead') as lead_count,
  COUNT(*) FILTER (WHERE type = 'comment') as comment_count,
  COUNT(*) FILTER (WHERE type = 'goal') as goal_count,
  MAX(created_at) FILTER (WHERE read = FALSE) as last_unread_at
FROM notifications
GROUP BY user_id;

-- Comentários
COMMENT ON TABLE notifications IS 'Tabela para armazenar notificações do sistema';
COMMENT ON COLUMN notifications.type IS 'Tipo de notificação: lead, comment, goal, post, project, system';
COMMENT ON COLUMN notifications.metadata IS 'Dados adicionais da notificação em formato JSON';
COMMENT ON FUNCTION cleanup_old_notifications() IS 'Limpa notificações lidas com mais de 90 dias';
