/*
  Warnings:

  - You are about to drop the column `alternate_date` on the `site_visits` table. All the data in the column will be lost.
  - You are about to drop the column `alternate_time` on the `site_visits` table. All the data in the column will be lost.
  - You are about to drop the column `special_requirements` on the `site_visits` table. All the data in the column will be lost.
  - You are about to drop the `newsletter_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "site_visits" DROP COLUMN "alternate_date",
DROP COLUMN "alternate_time",
DROP COLUMN "special_requirements",
ADD COLUMN     "admin_notes" TEXT,
ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "confirmed_at" TIMESTAMP(3),
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_name" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "preferred_mode" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "transport_mode" TEXT;

-- DropTable
DROP TABLE "public"."newsletter_subscriptions";
