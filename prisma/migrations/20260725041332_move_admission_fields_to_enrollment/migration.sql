/*
  Warnings:

  - You are about to drop the column `admissionDate` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `admissionNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `isHostelRequired` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `isTransportRequired` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentStatus` on the `StudentEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `joinedDate` on the `StudentEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `leftDate` on the `StudentEnrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[academicYearId,admissionNumber]` on the table `StudentEnrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admissionDate` to the `StudentEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admissionNumber` to the `StudentEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_admissionNumber_idx";

-- DropIndex
DROP INDEX "Student_admissionNumber_key";

-- DropIndex
DROP INDEX "StudentEnrollment_academicYearId_classId_sectionId_idx";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "admissionDate",
DROP COLUMN "admissionNumber",
DROP COLUMN "isHostelRequired",
DROP COLUMN "isTransportRequired",
DROP COLUMN "status",
ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudentEnrollment" DROP COLUMN "enrollmentStatus",
DROP COLUMN "joinedDate",
DROP COLUMN "leftDate",
ADD COLUMN     "admissionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "admissionNumber" TEXT NOT NULL,
ADD COLUMN     "isHostelRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTransportRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "StudentEnrollment_studentId_idx" ON "StudentEnrollment"("studentId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_academicYearId_idx" ON "StudentEnrollment"("academicYearId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_classId_idx" ON "StudentEnrollment"("classId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_sectionId_idx" ON "StudentEnrollment"("sectionId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_status_idx" ON "StudentEnrollment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEnrollment_academicYearId_admissionNumber_key" ON "StudentEnrollment"("academicYearId", "admissionNumber");
