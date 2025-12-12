-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "whatsapp_number" TEXT;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_maps_api_key" TEXT;
