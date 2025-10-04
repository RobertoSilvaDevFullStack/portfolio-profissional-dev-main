-- Adicionar campos SEO na tabela posts
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- Copiar dados existentes para os novos campos SEO se estiverem vazios
UPDATE posts 
SET seo_title = title 
WHERE seo_title IS NULL;

UPDATE posts 
SET seo_description = excerpt 
WHERE seo_description IS NULL;

-- Adicionar índices para performance em buscas
CREATE INDEX IF NOT EXISTS idx_posts_seo_title ON posts USING gin(to_tsvector('portuguese', seo_title));
CREATE INDEX IF NOT EXISTS idx_posts_seo_description ON posts USING gin(to_tsvector('portuguese', seo_description));

-- Comentários
COMMENT ON COLUMN posts.seo_title IS 'Título otimizado para SEO (recomendado: 30-60 caracteres)';
COMMENT ON COLUMN posts.seo_description IS 'Meta descrição para SEO (recomendado: 120-160 caracteres)';
COMMENT ON COLUMN posts.seo_keywords IS 'Array de palavras-chave para SEO';
