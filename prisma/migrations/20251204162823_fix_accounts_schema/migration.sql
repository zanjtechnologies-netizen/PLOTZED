/*
  Warnings:

  - You are about to drop the column `created_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `google_maps_api_key` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp_number` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `testimonials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company_email]` on the table `site_settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `site_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `testimonials` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "testimonials_is_featured_idx";

-- DropIndex
DROP INDEX "testimonials_is_published_idx";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "site_settings" DROP COLUMN "created_at",
DROP COLUMN "google_maps_api_key",
DROP COLUMN "settings",
DROP COLUMN "updated_at",
DROP COLUMN "whatsapp_number",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "site_name" DROP NOT NULL,
ALTER COLUMN "site_name" DROP DEFAULT,
ALTER COLUMN "business_hours" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "created_at",
DROP COLUMN "is_featured",
DROP COLUMN "is_published",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "rating" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_company_email_key" ON "site_settings"("company_email");
