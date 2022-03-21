/*
  Warnings:

  - You are about to drop the column `completed_at` on the `survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "survey" DROP COLUMN "completed_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
