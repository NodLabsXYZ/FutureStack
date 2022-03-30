/*
  Warnings:

  - Added the required column `content_type` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" BIGINT NOT NULL;

ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY insert_profile_access
ON public.profiles
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY select_profile_access 
ON public.profiles
FOR SELECT
USING (
  auth.uid() = profiles.user_id
);

CREATE POLICY update_profile_access 
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = profiles.user_id
);

CREATE POLICY delete_profile_access 
ON public.profiles
FOR DELETE
USING (
  auth.uid() = profiles.user_id
);
