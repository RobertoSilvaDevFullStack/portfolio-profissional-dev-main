-- Criar tabela para tracking de compartilhamentos
-- Execute este script no SQL Editor do Supabase para habilitar métricas de compartilhamento

-- Criar tabela de métricas de compartilhamento
CREATE TABLE IF NOT EXISTS public.share_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'copy', 'native')),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.share_metrics ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (para estatísticas gerais)
CREATE POLICY "Allow public read access to share metrics"
ON public.share_metrics FOR SELECT
TO public
USING (true);

-- Política para inserção por usuários autenticados e anônimos
CREATE POLICY "Allow insert share metrics"
ON public.share_metrics FOR INSERT
TO public
WITH CHECK (true);

-- Política para gerenciamento completo por usuários autenticados (admin)
CREATE POLICY "Allow authenticated users to manage share metrics"
ON public.share_metrics FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS share_metrics_post_id_idx ON public.share_metrics(post_id);
CREATE INDEX IF NOT EXISTS share_metrics_platform_idx ON public.share_metrics(platform);
CREATE INDEX IF NOT EXISTS share_metrics_shared_at_idx ON public.share_metrics(shared_at DESC);

-- Criar view para estatísticas agregadas por post
CREATE OR REPLACE VIEW public.post_share_stats AS
SELECT 
  p.id as post_id,
  p.title as post_title,
  p.slug as post_slug,
  COUNT(sm.id) as total_shares,
  COUNT(CASE WHEN sm.platform = 'linkedin' THEN 1 END) as linkedin_shares,
  COUNT(CASE WHEN sm.platform = 'instagram' THEN 1 END) as instagram_shares,
  COUNT(CASE WHEN sm.platform = 'copy' THEN 1 END) as copy_shares,
  COUNT(CASE WHEN sm.platform = 'native' THEN 1 END) as native_shares,
  MAX(sm.shared_at) as last_shared_at
FROM public.posts p
LEFT JOIN public.share_metrics sm ON p.id = sm.post_id
GROUP BY p.id, p.title, p.slug
ORDER BY total_shares DESC;

-- Criar view para estatísticas gerais
CREATE OR REPLACE VIEW public.overall_share_stats AS
SELECT 
  COUNT(*) as total_shares,
  COUNT(CASE WHEN platform = 'linkedin' THEN 1 END) as linkedin_shares,
  COUNT(CASE WHEN platform = 'instagram' THEN 1 END) as instagram_shares,
  COUNT(CASE WHEN platform = 'copy' THEN 1 END) as copy_shares,
  COUNT(CASE WHEN platform = 'native' THEN 1 END) as native_shares,
  COUNT(DISTINCT post_id) as unique_posts_shared,
  DATE_TRUNC('day', shared_at) as share_date,
  COUNT(*) as daily_shares
FROM public.share_metrics
GROUP BY DATE_TRUNC('day', shared_at)
ORDER BY share_date DESC;

-- Função para registrar compartilhamento
CREATE OR REPLACE FUNCTION public.log_share(
  p_post_id UUID,
  p_platform TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  share_id UUID;
BEGIN
  INSERT INTO public.share_metrics (post_id, platform, user_agent, referrer)
  VALUES (p_post_id, p_platform, p_user_agent, p_referrer)
  RETURNING id INTO share_id;
  
  RETURN share_id;
END;
$$;

-- Inserir alguns dados de exemplo (OPCIONAL - descomente se quiser)
/*
-- Primeiro, vamos buscar alguns posts existentes
DO $$
DECLARE
  post_record RECORD;
BEGIN
  -- Para cada post existente, criar algumas métricas de exemplo
  FOR post_record IN SELECT id FROM public.posts LIMIT 3 LOOP
    -- LinkedIn shares
    INSERT INTO public.share_metrics (post_id, platform, shared_at)
    VALUES 
      (post_record.id, 'linkedin', NOW() - INTERVAL '1 day'),
      (post_record.id, 'linkedin', NOW() - INTERVAL '2 days'),
      (post_record.id, 'linkedin', NOW() - INTERVAL '3 days');
    
    -- Instagram shares
    INSERT INTO public.share_metrics (post_id, platform, shared_at)
    VALUES 
      (post_record.id, 'instagram', NOW() - INTERVAL '1 day'),
      (post_record.id, 'instagram', NOW() - INTERVAL '4 days');
    
    -- Copy shares
    INSERT INTO public.share_metrics (post_id, platform, shared_at)
    VALUES 
      (post_record.id, 'copy', NOW() - INTERVAL '2 hours'),
      (post_record.id, 'copy', NOW() - INTERVAL '1 day');
  END LOOP;
END $$;
*/

-- Verificar se tudo foi criado corretamente
SELECT 
  'Tabela share_metrics criada: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'share_metrics' AND table_schema = 'public'
  ) THEN '✅' ELSE '❌' END as status_tabela,
  
  'Views criadas: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_name IN ('post_share_stats', 'overall_share_stats') AND table_schema = 'public'
  ) THEN '✅' ELSE '❌' END as status_views,
  
  'Função criada: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'log_share' AND routine_schema = 'public'
  ) THEN '✅' ELSE '❌' END as status_funcao;