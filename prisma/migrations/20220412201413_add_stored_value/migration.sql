-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "stored_value" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "amount" BIGINT NOT NULL,
    "profile_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
