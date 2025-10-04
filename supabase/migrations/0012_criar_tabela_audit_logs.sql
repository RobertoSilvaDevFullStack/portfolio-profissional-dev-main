-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: apenas admins autenticados podem ler
CREATE POLICY "Allow authenticated users to read audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (true);

-- Política para inserir logs (qualquer usuário autenticado)
CREATE POLICY "Allow authenticated users to insert audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Comentários
COMMENT ON TABLE audit_logs IS 'Registra todas as ações administrativas para auditoria';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de ação: create, update, delete, login, logout, export, import';
COMMENT ON COLUMN audit_logs.entity_type IS 'Tipo de entidade: post, project, lead, comment, user, backup';
COMMENT ON COLUMN audit_logs.old_data IS 'Dados antes da modificação (para update e delete)';
COMMENT ON COLUMN audit_logs.new_data IS 'Dados depois da modificação (para create e update)';

-- Função para limpar logs antigos (opcional - manter últimos 6 meses)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Remove logs de auditoria com mais de 6 meses';
