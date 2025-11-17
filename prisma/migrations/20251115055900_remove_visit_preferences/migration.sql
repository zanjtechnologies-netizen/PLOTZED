/*
  Warnings:

  - You are about to drop the column `preferred_mode` on the `site_visits` table. All the data in the column will be lost.
  - You are about to drop the column `transport_mode` on the `site_visits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "site_visits" DROP COLUMN "preferred_mode",
DROP COLUMN "transport_mode";
