CREATE SCHEMA IF NOT EXISTS "auth";


CREATE SCHEMA IF NOT EXISTS "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;





-- AddUUIDs
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ALTER TABLE public.profile ALTER COLUMN id SET DEFAULT uuid_generate_v4();
-- ALTER TABLE public.profile ALTER COLUMN secret_key SET DEFAULT uuid_generate_v4();
-- ALTER TABLE public.project ALTER COLUMN id SET DEFAULT uuid_generate_v4();
-- ALTER TABLE public.team ALTER COLUMN id SET DEFAULT uuid_generate_v4();
-- ALTER TABLE public.contract ALTER COLUMN id SET DEFAULT uuid_generate_v4();
-- ALTER TABLE public.asset ALTER COLUMN id SET DEFAULT uuid_generate_v4();

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

-- AddPolicies
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
      (
        (profile.id = "_profileToteam"."A") 
        AND ("_profileToteam"."B" = project.team_id) 
        AND (project.id = asset.project_id)
      )
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