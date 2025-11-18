-- AlterTable: Add default empty arrays for kyc_documents and saved_plots
-- This fixes OAuth user creation which was failing due to missing array values

-- Update existing rows to have empty arrays if they're somehow NULL
UPDATE "users" SET "kyc_documents" = '{}' WHERE "kyc_documents" IS NULL;
UPDATE "users" SET "saved_plots" = '{}' WHERE "saved_plots" IS NULL;

-- Add default values for future inserts
ALTER TABLE "users" ALTER COLUMN "kyc_documents" SET DEFAULT '{}';
ALTER TABLE "users" ALTER COLUMN "saved_plots" SET DEFAULT '{}';
