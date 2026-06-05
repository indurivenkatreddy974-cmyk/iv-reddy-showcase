GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;