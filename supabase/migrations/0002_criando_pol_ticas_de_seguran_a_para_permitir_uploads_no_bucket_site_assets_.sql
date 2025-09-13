CREATE POLICY "Allow authenticated users to manage site assets"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'site-assets')
WITH CHECK (bucket_id = 'site-assets');