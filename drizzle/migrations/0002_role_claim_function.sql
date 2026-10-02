DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
DROP FUNCTION IF EXISTS public.assign_default_role();

-- Called by the signed-in user. First caller ever becomes Owner, others become User. Idempotent.
CREATE OR REPLACE FUNCTION public.ensure_my_role()
RETURNS public.app_role LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _r public.app_role;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  PERFORM pg_advisory_xact_lock(424242);
  SELECT role INTO _r FROM public.user_roles WHERE user_id = _uid
    ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END LIMIT 1;
  IF _r IS NOT NULL THEN RETURN _r; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner') THEN
    _r := 'owner';
  ELSE
    _r := 'user';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, _r);
  RETURN _r;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_my_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_my_role() TO authenticated;