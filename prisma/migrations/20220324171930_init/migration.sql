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

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "username" TEXT,
    "email" TEXT,
    "avatar_url" TEXT,
    "user_id" UUID NOT NULL,
    "secret_key" UUID DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "team_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "info" JSONB NOT NULL,
    "opensource" BOOLEAN NOT NULL DEFAULT false,
    "compiled_at" TIMESTAMP(3) NOT NULL,
    "project_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_deployments" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "info" JSONB NOT NULL,
    "deployed_at" TIMESTAMP(3) NOT NULL,
    "project_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "contract_deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "image_uri" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "onchain_image_uri" TEXT,
    "onchain_metadata_uri" TEXT,
    "project_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "email" TEXT,
    "results" JSONB,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_profilesToteams" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_profilesToteams_AB_unique" ON "_profilesToteams"("A", "B");

-- CreateIndex
CREATE INDEX "_profilesToteams_B_index" ON "_profilesToteams"("B");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_deployments" ADD CONSTRAINT "contract_deployments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_deployments" ADD CONSTRAINT "contract_deployments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesToteams" ADD FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profilesToteams" ADD FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- AddUpdatedAt
CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.profiles 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.teams
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.projects 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.contracts 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.assets 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.contract_deployments
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.surveys 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);

-- AddPolicies
CREATE POLICY profile_contract_deployment_access 
ON public.contract_deployments
WITH CHECK (
  auth.uid() IN ( 
    SELECT profiles.user_id 
    FROM profiles, "_profilesToteams", projects
    WHERE (
      (profiles.id = "_profilesToteams"."A") 
      AND ("_profilesToteams"."B" = projects.team_id) 
      AND (projects.id = contract_deployments.project_id)
    )
  )
);

CREATE POLICY profile_contract_access 
ON public.contracts
WITH CHECK (
  auth.uid() IN ( 
    SELECT profiles.user_id 
    FROM profiles, "_profilesToteams", projects 
    WHERE (
      (
        (profiles.id = "_profilesToteams"."A") 
        AND ("_profilesToteams"."B" = projects.team_id) 
        AND (projects.id = contracts.project_id)
      ) OR (
        contracts.opensource = true
      )
    )
  )
);

CREATE POLICY profile_asset_access 
ON public.assets
WITH CHECK (
  auth.uid() IN ( 
    SELECT profiles.user_id 
    FROM profiles, "_profilesToteams", projects
    WHERE (
      (profiles.id = "_profilesToteams"."A") 
      AND ("_profilesToteams"."B" = projects.team_id) 
      AND (projects.id = assets.project_id)
    )
  )
);


CREATE POLICY profile_project_access
ON public.projects
WITH CHECK (
  auth.uid() IN ( 
    SELECT profiles.user_id 
    FROM profiles, "_profilesToteams" 
    WHERE (
      (profiles.id = "_profilesToteams"."A") 
      AND ("_profilesToteams"."B" = projects.team_id)
    )
  )
);
