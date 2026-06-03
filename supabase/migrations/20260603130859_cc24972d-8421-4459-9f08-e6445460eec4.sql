
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- One-time admin claim: any authenticated user can insert admin row for self ONLY when no admin exists
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  existing_admin_count int;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT count(*) INTO existing_admin_count FROM public.user_roles WHERE role = 'admin';
  IF existing_admin_count > 0 THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin');
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Helper to check if any admin exists (public)
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;

GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

-- ============ SHOWCASE KINDS ============
CREATE TYPE public.showcase_kind AS ENUM ('project', 'certification', 'achievement', 'video');
CREATE TYPE public.showcase_layout AS ENUM ('grid', 'carousel', 'masonry', 'featured');
CREATE TYPE public.media_kind AS ENUM ('image', 'video', 'pdf', 'other');

-- ============ SHOWCASE ITEMS ============
CREATE TABLE public.showcase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.showcase_kind NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  media_url text,
  poster_url text,
  live_url text,
  github_url text,
  tech text[] NOT NULL DEFAULT '{}',
  issuer text,
  issue_date date,
  verify_url text,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX showcase_items_kind_sort_idx ON public.showcase_items (kind, sort_order);
CREATE INDEX showcase_items_featured_idx ON public.showcase_items (featured) WHERE featured;

GRANT SELECT ON public.showcase_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.showcase_items TO authenticated;
GRANT ALL ON public.showcase_items TO service_role;

ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view showcase items"
ON public.showcase_items FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert showcase items"
ON public.showcase_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update showcase items"
ON public.showcase_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete showcase items"
ON public.showcase_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ MEDIA ASSETS ============
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.media_kind NOT NULL,
  name text NOT NULL,
  storage_path text NOT NULL,
  original_url text NOT NULL,
  webp_url text,
  poster_url text,
  width int,
  height int,
  duration_seconds numeric,
  size_bytes bigint,
  mime text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media assets"
ON public.media_assets FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage media assets"
ON public.media_assets FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SHOWCASE SETTINGS (singleton) ============
CREATE TABLE public.showcase_settings (
  id int PRIMARY KEY DEFAULT 1,
  layout public.showcase_layout NOT NULL DEFAULT 'grid',
  featured_projects_first boolean NOT NULL DEFAULT true,
  featured_certs_first boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT showcase_settings_singleton CHECK (id = 1)
);

INSERT INTO public.showcase_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

GRANT SELECT ON public.showcase_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.showcase_settings TO authenticated;
GRANT ALL ON public.showcase_settings TO service_role;

ALTER TABLE public.showcase_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view showcase settings"
ON public.showcase_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update showcase settings"
ON public.showcase_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert showcase settings"
ON public.showcase_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER showcase_items_set_updated_at
BEFORE UPDATE ON public.showcase_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER showcase_settings_set_updated_at
BEFORE UPDATE ON public.showcase_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
