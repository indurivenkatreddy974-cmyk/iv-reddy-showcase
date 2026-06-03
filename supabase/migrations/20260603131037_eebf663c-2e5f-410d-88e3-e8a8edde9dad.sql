
CREATE POLICY "Anyone can read showcase media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'showcase-media');

CREATE POLICY "Admins can upload showcase media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'showcase-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update showcase media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'showcase-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete showcase media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'showcase-media' AND public.has_role(auth.uid(), 'admin'));
