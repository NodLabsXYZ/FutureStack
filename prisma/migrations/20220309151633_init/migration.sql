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
CREATE TABLE "profile" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "username" TEXT,
    "email" TEXT,
    "avatar_url" TEXT,
    "user_id" UUID NOT NULL,
    "secret_key" UUID DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "team_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "info" JSONB NOT NULL,
    "opensource" BOOLEAN NOT NULL DEFAULT false,
    "compiled_at" TIMESTAMP(3) NOT NULL,
    "project_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_deployment" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "info" JSONB NOT NULL,
    "deployed_at" TIMESTAMP(3) NOT NULL,
    "project_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "contract_deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "image_uri" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "onchain_image_uri" TEXT,
    "onchain_metadata_uri" TEXT,
    "project_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_profileToteam" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_username_key" ON "profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "profile_email_key" ON "profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_profileToteam_AB_unique" ON "_profileToteam"("A", "B");

-- CreateIndex
CREATE INDEX "_profileToteam_B_index" ON "_profileToteam"("B");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_deployment" ADD CONSTRAINT "contract_deployment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_deployment" ADD CONSTRAINT "contract_deployment_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profileToteam" ADD FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profileToteam" ADD FOREIGN KEY ("B") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
