/*
  Warnings:

  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_plot_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_user_id_fkey";

-- AlterTable
ALTER TABLE "site_visits" ADD COLUMN     "alternate_date" TIMESTAMP(3),
ADD COLUMN     "alternate_time" TEXT,
ADD COLUMN     "special_requirements" TEXT;

-- DropTable
DROP TABLE "public"."bookings";

-- DropTable
DROP TABLE "public"."payments";

-- DropEnum
DROP TYPE "public"."BookingStatus";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- DropEnum
DROP TYPE "public"."PaymentType";

-- CreateIndex
CREATE INDEX "site_visits_status_idx" ON "site_visits"("status");
