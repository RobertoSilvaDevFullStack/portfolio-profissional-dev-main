CREATE POLICY "Allow authenticated users to manage project assets"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'project-assets')
WITH CHECK (bucket_id = 'project-assets');