-- Coordinates are authoritative site coordinates, never inferred from a cleaner's GPS.
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS site_latitude double precision CHECK(site_latitude BETWEEN -90 AND 90), ADD COLUMN IF NOT EXISTS site_longitude double precision CHECK(site_longitude BETWEEN -180 AND 180);
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS site_latitude double precision CHECK(site_latitude BETWEEN -90 AND 90), ADD COLUMN IF NOT EXISTS site_longitude double precision CHECK(site_longitude BETWEEN -180 AND 180);
CREATE TABLE private.attendance_tag_proofs(tx bigint NOT NULL,job_id uuid NOT NULL,user_id uuid NOT NULL,PRIMARY KEY(tx,job_id,user_id));
ALTER TABLE private.attendance_tag_proofs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.attendance_tag_proofs FROM PUBLIC,anon,authenticated;
CREATE FUNCTION private.haversine_meters(a double precision,b double precision,c double precision,d double precision) RETURNS double precision LANGUAGE sql IMMUTABLE STRICT SET search_path='' AS $$
SELECT 12742000*asin(sqrt(least(1::double precision,greatest(0::double precision,power(sin(radians(c-a)/2),2)+cos(radians(a))*cos(radians(c))*power(sin(radians(d-b)/2),2))))) $$;
REVOKE ALL ON FUNCTION private.haversine_meters(double precision,double precision,double precision,double precision) FROM PUBLIC,anon,authenticated;
CREATE FUNCTION private.enforce_checkin_geofence() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE lat double precision; lon double precision; verified boolean;
BEGIN
 IF auth.uid() IS NULL OR private.is_company_owner(OLD.company_id) THEN RETURN NEW; END IF;
 IF NOT private.is_assigned_staff(OLD.staff_id,OLD.company_id) THEN RAISE EXCEPTION 'Assigned employee required' USING ERRCODE='42501'; END IF;
 IF OLD.status='scheduled' AND NEW.status='in_progress' THEN
  DELETE FROM private.attendance_tag_proofs WHERE tx=txid_current() AND job_id=OLD.id AND user_id=auth.uid(); verified:=FOUND;
  IF NEW.check_in_latitude IS NULL OR NEW.check_in_longitude IS NULL OR NOT(NEW.check_in_latitude BETWEEN -90 AND 90 AND NEW.check_in_longitude BETWEEN -180 AND 180) THEN RAISE EXCEPTION 'Valid GPS coordinates required'; END IF;
  IF verified THEN RETURN NEW; END IF;
  IF OLD.site_latitude IS NOT NULL AND OLD.site_longitude IS NOT NULL THEN lat:=OLD.site_latitude; lon:=OLD.site_longitude;
  ELSE SELECT site_latitude,site_longitude INTO lat,lon FROM public.clients WHERE id=OLD.client_id AND company_id=OLD.company_id; END IF;
  IF lat IS NULL OR lon IS NULL THEN RAISE EXCEPTION 'Site coordinates are not configured. Ask your manager or scan the registered site NFC/QR tag.' USING ERRCODE='22023'; END IF;
  IF private.haversine_meters(NEW.check_in_latitude,NEW.check_in_longitude,lat,lon)>200 THEN RAISE EXCEPTION 'You must be within 200 metres of the service location to check in. Move to the site or scan its registered NFC/QR tag.' USING ERRCODE='22023'; END IF;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION private.enforce_checkin_geofence() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER jobs_geofence_checkin BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION private.enforce_checkin_geofence();
-- Only the server-validated tag RPC can issue this transaction-scoped bypass.
DO $$ DECLARE definition text; BEGIN
 definition:=pg_get_functiondef('public.cleaner_nfc_attendance(uuid,text,text,double precision,double precision)'::regprocedure);
 IF position('IF action=' IN definition)=0 THEN RAISE EXCEPTION 'Unexpected NFC function definition'; END IF;
 definition:=replace(definition,'IF action=',E'IF action=');
 definition:=replace(definition,'IF action=''in_progress'' AND j.status=''scheduled'' THEN',E'IF action=''in_progress'' AND j.status=''scheduled'' THEN\n INSERT INTO private.attendance_tag_proofs VALUES(txid_current(),j.id,auth.uid());');
 EXECUTE definition;
END $$;
