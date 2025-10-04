-- Adicionar coluna de status na tabela leads
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna status se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.leads 
    ADD COLUMN status TEXT DEFAULT 'new' 
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted'));
  END IF;
END $$;

-- Criar índice para melhor performance nas consultas por status
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);

-- Atualizar leads existentes para status 'new' se estiverem NULL
UPDATE public.leads SET status = 'new' WHERE status IS NULL;

-- Verificar se a coluna foi criada corretamente
SELECT 
  'Coluna status criada: ' || 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'status'
  ) THEN '✅' ELSE '❌' END as status_coluna;
