-- Create posts table for blog functionality
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  author_name TEXT DEFAULT 'Roberto Vicente da Silva',
  author_avatar_url TEXT,
  asset_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies for posts table
-- Allow everyone to read posts (public access)
CREATE POLICY "Allow public read access to posts"
ON public.posts FOR SELECT
TO public
USING (true);

-- Allow authenticated users to manage posts (admin functionality)
CREATE POLICY "Allow authenticated users to manage posts"
ON public.posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX posts_slug_idx ON public.posts(slug);
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_posts_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update updated_at
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_posts_updated_at();