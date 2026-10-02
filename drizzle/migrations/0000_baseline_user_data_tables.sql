CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  pinned BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own notes" ON public.notes;
CREATE POLICY "Users manage own notes" ON public.notes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  importance TEXT NOT NULL DEFAULT 'MEDIUM',
  source TEXT NOT NULL DEFAULT 'Manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memories TO authenticated;
GRANT ALL ON public.memories TO service_role;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own memories" ON public.memories;
CREATE POLICY "Users manage own memories" ON public.memories FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '09:00',
  duration_min INTEGER NOT NULL DEFAULT 30,
  tag TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own events" ON public.events;
CREATE POLICY "Users manage own events" ON public.events FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);