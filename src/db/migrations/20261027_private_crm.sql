-- Run once through the Supabase SQL editor before enabling CRM writes.
-- CRM data is accessible only through authenticated server actions using service_role.
BEGIN;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS leads jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  id text NOT NULL DEFAULT gen_random_uuid()::text,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 120),
  email text,
  phone text,
  company text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'bio')),
  follow_up_on date,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (business_id, id)
);
CREATE INDEX IF NOT EXISTS crm_contacts_business_follow_up_idx ON public.crm_contacts (business_id, follow_up_on) WHERE archived_at IS NULL;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_contacts FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.crm_contacts TO service_role;
-- No anonymous/authenticated policies: browser clients cannot read or write CRM data.

-- Stage changes and legacy inquiry reassignment commit together.
CREATE OR REPLACE FUNCTION public.crm_update_stages(
  p_business_id uuid, p_user_id text, p_stages text[], p_renamed jsonb DEFAULT '{}'::jsonb
) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_business public.businesses%ROWTYPE;
  v_item jsonb;
  v_leads jsonb := '[]'::jsonb;
  v_stage text;
  v_old_first text;
BEGIN
  IF coalesce(cardinality(p_stages), 0) NOT BETWEEN 1 AND 15 OR EXISTS (
    SELECT 1 FROM unnest(p_stages) AS s WHERE s IS NULL OR length(btrim(s)) NOT BETWEEN 1 AND 60
  ) OR cardinality(p_stages) <> (SELECT count(DISTINCT s) FROM unnest(p_stages) AS s)
  THEN RAISE EXCEPTION 'Invalid stages'; END IF;
  SELECT * INTO v_business FROM public.businesses WHERE id = p_business_id AND user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Workspace unavailable'; END IF;
  v_old_first := coalesce(v_business.social_links->'lead_stages'->>0, 'New');
  FOR v_item IN SELECT value FROM jsonb_array_elements(CASE WHEN jsonb_typeof(v_business.leads) = 'array' THEN v_business.leads ELSE '[]'::jsonb END)
  LOOP
    v_stage := coalesce(v_item->>'status', v_old_first);
    v_stage := coalesce(p_renamed->>v_stage, v_stage);
    IF NOT (v_stage = ANY(p_stages)) THEN v_stage := p_stages[1]; END IF;
    v_leads := v_leads || jsonb_build_array(jsonb_set(v_item, '{status}', to_jsonb(v_stage)));
  END LOOP;
  UPDATE public.crm_contacts SET status = CASE
    WHEN coalesce(p_renamed->>status, status) = ANY(p_stages) THEN coalesce(p_renamed->>status, status)
    ELSE p_stages[1] END, updated_at = clock_timestamp()
    WHERE business_id = p_business_id;
  UPDATE public.businesses SET leads = v_leads,
    social_links = jsonb_set(coalesce(social_links, '{}'::jsonb), '{lead_stages}', to_jsonb(p_stages))
    WHERE id = p_business_id AND user_id = p_user_id;
END;
$$;
REVOKE ALL ON FUNCTION public.crm_update_stages(uuid, text, text[], jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_update_stages(uuid, text, text[], jsonb) TO service_role;
COMMIT;
