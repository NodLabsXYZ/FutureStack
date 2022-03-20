-- CreateTable
CREATE TABLE "survey" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "email" TEXT,
    "results" JSONB,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "survey" ADD CONSTRAINT "survey_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TRIGGER handle_updated_at 
BEFORE UPDATE on public.survey 
  FOR EACH ROW EXECUTE PROCEDURE extensions.moddatetime (updated_at);