-- CreateEnum
CREATE TYPE "InstallmentCalcType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "InstallmentDueRule" AS ENUM ('ADMISSION_DATE', 'FIXED_DATE', 'OFFSET_DAYS');

-- CreateEnum
CREATE TYPE "InstallmentPlanType" AS ENUM ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "fee_structures" ADD COLUMN     "installment_plan_id" TEXT;

-- AlterTable
ALTER TABLE "student_enrollments" ADD COLUMN     "installment_plan_id" TEXT;

-- CreateTable
CREATE TABLE "fee_structure_installment_plans" (
    "id" TEXT NOT NULL,
    "fee_structure_id" TEXT NOT NULL,
    "installment_plan_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structure_installment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installment_plans" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "plan_type" "InstallmentPlanType" NOT NULL DEFAULT 'MONTHLY',
    "description" VARCHAR(255),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "effective_from" TIMESTAMP(3),
    "effective_to" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "installment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installment_plan_items" (
    "id" TEXT NOT NULL,
    "installment_plan_id" TEXT NOT NULL,
    "fee_component_id" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "due_rule" "InstallmentDueRule" NOT NULL DEFAULT 'FIXED_DATE',
    "due_day" INTEGER,
    "due_month" INTEGER,
    "due_offset_days" INTEGER,
    "calculation_type" "InstallmentCalcType" NOT NULL DEFAULT 'PERCENTAGE',
    "value" DECIMAL(10,2) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installment_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_types" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255),
    "percentage" DECIMAL(5,2),
    "fixed_amount" DECIMAL(10,2),
    "max_limit" DECIMAL(10,2),
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "discount_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_type_components" (
    "id" TEXT NOT NULL,
    "discount_type_id" TEXT NOT NULL,
    "fee_component_id" TEXT NOT NULL,

    CONSTRAINT "discount_type_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment_discounts" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "discount_type_id" TEXT NOT NULL,
    "original_amount" DECIMAL(10,2) NOT NULL,
    "applied_amount" DECIMAL(10,2) NOT NULL,
    "final_amount" DECIMAL(10,2) NOT NULL,
    "applied_percentage" DECIMAL(5,2),
    "approved_by_id" TEXT,
    "remarks" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollment_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fee_structure_installment_plans_fee_structure_id_idx" ON "fee_structure_installment_plans"("fee_structure_id");

-- CreateIndex
CREATE INDEX "fee_structure_installment_plans_installment_plan_id_idx" ON "fee_structure_installment_plans"("installment_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structure_installment_plans_fee_structure_id_installmen_key" ON "fee_structure_installment_plans"("fee_structure_id", "installment_plan_id");

-- CreateIndex
CREATE INDEX "installment_plans_tenant_id_academic_year_id_class_id_statu_idx" ON "installment_plans"("tenant_id", "academic_year_id", "class_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "installment_plans_tenant_id_academic_year_id_class_id_code__key" ON "installment_plans"("tenant_id", "academic_year_id", "class_id", "code", "deleted_at");

-- CreateIndex
CREATE INDEX "installment_plan_items_installment_plan_id_idx" ON "installment_plan_items"("installment_plan_id");

-- CreateIndex
CREATE INDEX "installment_plan_items_fee_component_id_idx" ON "installment_plan_items"("fee_component_id");

-- CreateIndex
CREATE INDEX "discount_types_tenant_id_status_idx" ON "discount_types"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "discount_types_tenant_id_code_deleted_at_key" ON "discount_types"("tenant_id", "code", "deleted_at");

-- CreateIndex
CREATE INDEX "discount_type_components_discount_type_id_idx" ON "discount_type_components"("discount_type_id");

-- CreateIndex
CREATE INDEX "discount_type_components_fee_component_id_idx" ON "discount_type_components"("fee_component_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_type_components_discount_type_id_fee_component_id_key" ON "discount_type_components"("discount_type_id", "fee_component_id");

-- CreateIndex
CREATE INDEX "enrollment_discounts_enrollment_id_idx" ON "enrollment_discounts"("enrollment_id");

-- CreateIndex
CREATE INDEX "enrollment_discounts_discount_type_id_idx" ON "enrollment_discounts"("discount_type_id");

-- CreateIndex
CREATE INDEX "enrollment_discounts_approved_by_id_idx" ON "enrollment_discounts"("approved_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_discounts_enrollment_id_discount_type_id_key" ON "enrollment_discounts"("enrollment_id", "discount_type_id");

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "installment_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "installment_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_installment_plans" ADD CONSTRAINT "fee_structure_installment_plans_fee_structure_id_fkey" FOREIGN KEY ("fee_structure_id") REFERENCES "fee_structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_installment_plans" ADD CONSTRAINT "fee_structure_installment_plans_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "installment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plans" ADD CONSTRAINT "installment_plans_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plans" ADD CONSTRAINT "installment_plans_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plan_items" ADD CONSTRAINT "installment_plan_items_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "installment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plan_items" ADD CONSTRAINT "installment_plan_items_fee_component_id_fkey" FOREIGN KEY ("fee_component_id") REFERENCES "fee_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_type_components" ADD CONSTRAINT "discount_type_components_discount_type_id_fkey" FOREIGN KEY ("discount_type_id") REFERENCES "discount_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_type_components" ADD CONSTRAINT "discount_type_components_fee_component_id_fkey" FOREIGN KEY ("fee_component_id") REFERENCES "fee_components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_discounts" ADD CONSTRAINT "enrollment_discounts_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "student_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_discounts" ADD CONSTRAINT "enrollment_discounts_discount_type_id_fkey" FOREIGN KEY ("discount_type_id") REFERENCES "discount_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_discounts" ADD CONSTRAINT "enrollment_discounts_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
