/*
  Warnings:

  - You are about to drop the column `image_uri` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `onchain_image_uri` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `onchain_metadata_uri` on the `assets` table. All the data in the column will be lost.
  - Added the required column `info` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "image_uri",
DROP COLUMN "metadata",
DROP COLUMN "onchain_image_uri",
DROP COLUMN "onchain_metadata_uri",
ADD COLUMN     "info" JSONB NOT NULL;
