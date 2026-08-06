/*
  Warnings:

  - The `status` column on the `student_enrollments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "student_enrollments" DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "student_enrollments_status_idx" ON "student_enrollments"("status");
