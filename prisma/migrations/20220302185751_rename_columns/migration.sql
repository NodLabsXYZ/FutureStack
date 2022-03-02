/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "avatar_url",
DROP COLUMN "updated_at",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "project" DROP COLUMN "updated_at",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "team" DROP COLUMN "updated_at",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6);
