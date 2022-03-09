CREATE SCHEMA IF NOT EXISTS "auth";
DROP FUNCTION IF EXISTS "auth"."uid"();
CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
      coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;
ALTER FUNCTION "auth"."uid"() OWNER TO "supabase_auth_admin";
GRANT ALL ON FUNCTION "auth"."uid"() TO "dashboard_user";

CREATE SCHEMA IF NOT EXISTS "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;



-- AddUpdatedAt
CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.profile 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.team 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.project 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.contract 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.asset 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.contract_deployment
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

-- AddPolicies
CREATE POLICY profile_contract_deployment_access 
ON public.contract_deployment
WITH CHECK (
  auth.uid() IN ( 
    SELECT profile.user_id 
    FROM profile, "_profileToteam", project
    WHERE (
      (profile.id = "_profileToteam"."A") 
      AND ("_profileToteam"."B" = project.team_id) 
      AND (project.id = contract_deployment.project_id)
    )
  )
);

CREATE POLICY profile_contract_access 
ON public.contract
WITH CHECK (
  auth.uid() IN ( 
    SELECT profile.user_id 
    FROM profile, "_profileToteam", project 
    WHERE (
      (
        (profile.id = "_profileToteam"."A") 
        AND ("_profileToteam"."B" = project.team_id) 
        AND (project.id = contract.project_id)
      ) OR (
        contract.opensource = true
      )
    )
  )
);

CREATE POLICY profile_asset_access 
ON public.asset
WITH CHECK (
  auth.uid() IN ( 
    SELECT profile.user_id 
    FROM profile, "_profileToteam", project 
    WHERE (
      (profile.id = "_profileToteam"."A") 
      AND ("_profileToteam"."B" = project.team_id) 
      AND (project.id = asset.project_id)
    )
  )
);


CREATE POLICY profile_project_access
ON public.project
WITH CHECK (
  auth.uid() IN ( 
    SELECT profile.user_id 
    FROM profile, "_profileToteam" 
    WHERE (
      (profile.id = "_profileToteam"."A") 
      AND ("_profileToteam"."B" = project.team_id)
    )
  )
);
