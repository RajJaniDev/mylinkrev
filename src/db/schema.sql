-- Create businesses table
CREATE TABLE public.businesses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  google_review_url text,
  payment_status text DEFAULT 'pending',
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.businesses FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own business."
  ON public.businesses FOR INSERT
  WITH CHECK ( auth.uid()::text = user_id ); -- Note: We'll actually handle inserts via server with service role if Clerk user_id doesn't match Supabase auth.uid() directly.

CREATE POLICY "Users can update own business."
  ON public.businesses FOR UPDATE
  USING ( auth.uid()::text = user_id );

-- If using Clerk for auth, Supabase RLS is tricky because auth.uid() is for Supabase Auth.
-- To simplify since Clerk handles auth, you can create a policy that checks a custom JWT claim or simply bypass RLS for server-side operations and handle authorization in Next.js API routes.

-- To bypass RLS for server-side updates (using Service Role Key):
-- We will rely on Next.js server actions / API routes to validate the Clerk user session and perform DB operations.
