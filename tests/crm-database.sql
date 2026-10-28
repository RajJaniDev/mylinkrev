-- Run after the migration in a disposable database or Supabase SQL editor.
-- The transaction always rolls back all synthetic test records.
BEGIN;
DO $$
DECLARE
  v_business uuid := gen_random_uuid();
  v_other uuid := gen_random_uuid();
  v_denied boolean := false;
  v_leads jsonb;
  v_socials jsonb;
BEGIN
  IF has_table_privilege('anon', 'public.crm_contacts', 'SELECT') OR has_table_privilege('authenticated', 'public.crm_contacts', 'SELECT') THEN
    RAISE EXCEPTION 'CRM must not be directly readable by browser roles';
  END IF;
  IF has_function_privilege('anon', 'public.crm_update_stages(uuid,text,text[],jsonb)', 'EXECUTE') OR has_function_privilege('authenticated', 'public.crm_update_stages(uuid,text,text[],jsonb)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Browser roles must not execute the stage-management function';
  END IF;
  INSERT INTO public.businesses (id,user_id,slug,name,social_links,leads) VALUES
    (v_business,'crm-test-owner','crm-test-' || v_business,'CRM test','{"keep":"preserved","lead_stages":["New","Contacted","Accepted"]}', '[{"id":"legacy-1","name":"Sample contact","status":"Contacted","message":"Original request"}]'),
    (v_other,'crm-test-other','crm-test-' || v_other,'Other workspace','{}','[]');
  INSERT INTO public.crm_contacts (business_id,id,name,status,source,notes) VALUES
    (v_business,'manual-1','Sample client','Contacted','manual','Private notes'),
    (v_other,'manual-1','Other owner contact','Contacted','manual','Other notes');
  BEGIN
    PERFORM public.crm_update_stages(v_business,'not-the-owner',ARRAY['New','Client'],'{}');
  EXCEPTION WHEN OTHERS THEN v_denied := true;
  END;
  IF NOT v_denied THEN RAISE EXCEPTION 'Owner mismatch was accepted'; END IF;
  PERFORM public.crm_update_stages(v_business,'crm-test-owner',ARRAY['New','Client'], '{"Contacted":"Client"}');
  SELECT leads,social_links INTO v_leads,v_socials FROM public.businesses WHERE id=v_business;
  IF v_leads->0->>'status' <> 'Client' OR v_leads->0->>'message' <> 'Original request' THEN RAISE EXCEPTION 'Legacy inquiry was not preserved during rename'; END IF;
  IF v_socials->>'keep' <> 'preserved' THEN RAISE EXCEPTION 'Other profile settings were overwritten'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.crm_contacts WHERE business_id=v_business AND id='manual-1' AND status='Client' AND notes='Private notes') THEN RAISE EXCEPTION 'Private contact rename lost data'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.crm_contacts WHERE business_id=v_other AND id='manual-1' AND status='Contacted' AND notes='Other notes') THEN RAISE EXCEPTION 'Another workspace was changed'; END IF;
  UPDATE public.crm_contacts SET archived_at=now() WHERE business_id=v_business AND id='manual-1';
  IF (SELECT jsonb_array_length(leads) FROM public.businesses WHERE id=v_business) <> 1 THEN RAISE EXCEPTION 'Archiving changed the form allowance'; END IF;
  UPDATE public.crm_contacts SET archived_at=NULL WHERE business_id=v_business AND id='manual-1';
  PERFORM public.crm_update_stages(v_business,'crm-test-owner',ARRAY['New'],'{}');
  IF NOT EXISTS (SELECT 1 FROM public.crm_contacts WHERE business_id=v_business AND id='manual-1' AND status='New' AND notes='Private notes' AND archived_at IS NULL) THEN RAISE EXCEPTION 'Removed-stage reassignment or restore failed'; END IF;
END;
$$;
ROLLBACK;
