/*
  Warnings:

  - The values [CLOSED] on the enum `AcademicYearStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isCurrent` on the `AcademicYear` table. All the data in the column will be lost.
  - Made the column `code` on table `AcademicYear` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AcademicYearStatus_new" AS ENUM ('UPCOMING', 'ACTIVE', 'ARCHIVED');
ALTER TABLE "public"."AcademicYear" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AcademicYear" ALTER COLUMN "status" TYPE "AcademicYearStatus_new" USING ("status"::text::"AcademicYearStatus_new");
ALTER TYPE "AcademicYearStatus" RENAME TO "AcademicYearStatus_old";
ALTER TYPE "AcademicYearStatus_new" RENAME TO "AcademicYearStatus";
DROP TYPE "public"."AcademicYearStatus_old";
ALTER TABLE "AcademicYear" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "AcademicYear" DROP COLUMN "isCurrent",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "school_profiles" ADD COLUMN     "faviconUrl" TEXT;

-- CreateIndex
CREATE INDEX "AcademicYear_deletedAt_idx" ON "AcademicYear"("deletedAt");
