CREATE POLICY "Allow authenticated users to manage blog assets"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'blog-assets')
WITH CHECK (bucket_id = 'blog-assets');