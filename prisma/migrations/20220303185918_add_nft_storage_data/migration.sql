-- CreateTable
CREATE TABLE "nftStorageData" (
    "id" UUID NOT NULL,
    "centrallyStoredImageUri" TEXT NOT NULL,
    "centrallyStoredMetadata" JSONB NOT NULL,
    "arweaveImageUri" TEXT,
    "arweaveMetadataUri" TEXT,
    "projectId" UUID,

    CONSTRAINT "nftStorageData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nftStorageData" ADD CONSTRAINT "nftStorageData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
