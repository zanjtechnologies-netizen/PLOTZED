-- AlterTable: Add emailVerified field for NextAuth Prisma Adapter compatibility
-- NextAuth expects emailVerified as DateTime?, not email_verified as Boolean
-- We keep both fields: emailVerified for NextAuth, email_verified for our app logic

ALTER TABLE "users" ADD COLUMN "emailVerified" TIMESTAMP(3);

-- Sync existing data: if email_verified is true, set emailVerified to created_at
UPDATE "users" SET "emailVerified" = "created_at" WHERE "email_verified" = true;
