-- Rename columns in accounts table from camelCase to snake_case
ALTER TABLE "accounts" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "accounts" RENAME COLUMN "updatedAt" TO "updated_at";
