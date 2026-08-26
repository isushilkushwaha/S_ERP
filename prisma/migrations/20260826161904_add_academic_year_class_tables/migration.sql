/*
  Warnings:

  - You are about to drop the column `ledger_id` on the `fee_installments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollment_id,sequence]` on the table `fee_installments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enrollment_id` to the `fee_installments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `fee_installments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fee_installments" DROP CONSTRAINT "fee_installments_ledger_id_fkey";

-- DropForeignKey
ALTER TABLE "student_enrollments" DROP CONSTRAINT "student_enrollments_section_id_fkey";

-- DropIndex
DROP INDEX "fee_installments_ledger_id_idx";

-- AlterTable
ALTER TABLE "fee_installments" DROP COLUMN "ledger_id",
ADD COLUMN     "enrollment_id" TEXT NOT NULL,
ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "student_enrollments" ALTER COLUMN "section_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "academic_year_classes" (
    "id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "sections_enabled" BOOLEAN NOT NULL DEFAULT true,
    "default_section_capacity" INTEGER,
    "max_students_without_section" INTEGER,
    "auto_allocation_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_year_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_year_class_sections" (
    "id" TEXT NOT NULL,
    "academic_year_class_id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "academic_year_class_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_installment_components" (
    "id" TEXT NOT NULL,
    "installment_id" TEXT NOT NULL,
    "ledger_id" TEXT NOT NULL,
    "assigned_amount" DECIMAL(10,2) NOT NULL,
    "paid_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_installment_components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "academic_year_classes_academic_year_id_idx" ON "academic_year_classes"("academic_year_id");

-- CreateIndex
CREATE INDEX "academic_year_classes_class_id_idx" ON "academic_year_classes"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_classes_academic_year_id_class_id_key" ON "academic_year_classes"("academic_year_id", "class_id");

-- CreateIndex
CREATE INDEX "academic_year_class_sections_academic_year_class_id_status__idx" ON "academic_year_class_sections"("academic_year_class_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_class_sections_academic_year_class_id_name_de_key" ON "academic_year_class_sections"("academic_year_class_id", "name", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_class_sections_academic_year_class_id_display_key" ON "academic_year_class_sections"("academic_year_class_id", "display_order", "deleted_at");

-- CreateIndex
CREATE INDEX "fee_installment_components_installment_id_idx" ON "fee_installment_components"("installment_id");

-- CreateIndex
CREATE INDEX "fee_installment_components_ledger_id_idx" ON "fee_installment_components"("ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_installment_components_installment_id_ledger_id_key" ON "fee_installment_components"("installment_id", "ledger_id");

-- CreateIndex
CREATE INDEX "fee_installments_enrollment_id_sequence_idx" ON "fee_installments"("enrollment_id", "sequence");

-- CreateIndex
CREATE INDEX "fee_installments_due_date_idx" ON "fee_installments"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "fee_installments_enrollment_id_sequence_key" ON "fee_installments"("enrollment_id", "sequence");

-- AddForeignKey
ALTER TABLE "academic_year_classes" ADD CONSTRAINT "academic_year_classes_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year_classes" ADD CONSTRAINT "academic_year_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year_class_sections" ADD CONSTRAINT "academic_year_class_sections_academic_year_class_id_fkey" FOREIGN KEY ("academic_year_class_id") REFERENCES "academic_year_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_installments" ADD CONSTRAINT "fee_installments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "student_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_installment_components" ADD CONSTRAINT "fee_installment_components_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "fee_installments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_installment_components" ADD CONSTRAINT "fee_installment_components_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "student_fee_ledgers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
