/*
  Warnings:

  - You are about to drop the column `amount` on the `student_fee_ledgers` table. All the data in the column will be lost.
  - You are about to drop the column `is_paid` on the `student_fee_ledgers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollment_id,fee_component_id]` on the table `student_fee_ledgers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assigned_amount` to the `student_fee_ledgers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CHEQUE', 'CARD', 'BANK_TRANSFER', 'RAZORPAY');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('MANUAL', 'RAZORPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'PENDING', 'PARTIAL', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('PAYMENT_CREATED', 'PAYMENT_UPDATED', 'PAYMENT_CANCELLED', 'RECEIPT_REPRINTED', 'DISCOUNT_APPLIED', 'FINE_APPLIED');

-- CreateEnum
CREATE TYPE "AuditEntity" AS ENUM ('FEE_PAYMENT', 'FEE_RECEIPT', 'STUDENT_LEDGER');

-- DropIndex
DROP INDEX "student_fee_ledgers_is_paid_idx";

-- AlterTable
ALTER TABLE "student_enrollments" ADD COLUMN     "fee_structure_id" TEXT;

-- AlterTable
ALTER TABLE "student_fee_ledgers" DROP COLUMN "amount",
DROP COLUMN "is_paid",
ADD COLUMN     "assigned_amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "fee_structure_item_id" TEXT,
ADD COLUMN     "fine_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "last_payment_date" TIMESTAMP(3),
ADD COLUMN     "paid_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "fee_installments" (
    "id" TEXT NOT NULL,
    "ledger_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "assigned_amount" DECIMAL(10,2) NOT NULL,
    "paid_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payments" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_gateway" "PaymentGateway",
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "fine" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "transaction_id" TEXT,
    "gateway_order_id" TEXT,
    "gateway_payment_id" TEXT,
    "gateway_signature" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'SUCCESS',
    "remarks" VARCHAR(255),
    "received_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payment_items" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "ledger_id" TEXT NOT NULL,
    "installment_id" TEXT,
    "allocated_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_payment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_receipts" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "print_count" INTEGER NOT NULL DEFAULT 0,
    "printed_at" TIMESTAMP(3),
    "last_printed_by_id" TEXT,
    "is_cancelled" BOOLEAN NOT NULL DEFAULT false,
    "cancelled_at" TIMESTAMP(3),
    "cancelled_by_id" TEXT,
    "cancellation_reason" VARCHAR(255),
    "generated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_sequences" (
    "id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT 'RCP',
    "format" TEXT NOT NULL DEFAULT 'RCP/{YEAR}/{NUMBER}',
    "last_sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entity" "AuditEntity" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fee_installments_ledger_id_idx" ON "fee_installments"("ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_receipt_number_key" ON "fee_payments"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_transaction_id_key" ON "fee_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "fee_payments_enrollment_id_idx" ON "fee_payments"("enrollment_id");

-- CreateIndex
CREATE INDEX "fee_payments_receipt_number_idx" ON "fee_payments"("receipt_number");

-- CreateIndex
CREATE INDEX "fee_payments_received_by_id_idx" ON "fee_payments"("received_by_id");

-- CreateIndex
CREATE INDEX "fee_payment_items_payment_id_idx" ON "fee_payment_items"("payment_id");

-- CreateIndex
CREATE INDEX "fee_payment_items_ledger_id_idx" ON "fee_payment_items"("ledger_id");

-- CreateIndex
CREATE INDEX "fee_payment_items_installment_id_idx" ON "fee_payment_items"("installment_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_receipts_payment_id_key" ON "fee_receipts"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_receipts_receipt_number_key" ON "fee_receipts"("receipt_number");

-- CreateIndex
CREATE INDEX "fee_receipts_receipt_number_idx" ON "fee_receipts"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_sequences_academic_year_id_key" ON "receipt_sequences"("academic_year_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs"("entity_id");

-- CreateIndex
CREATE INDEX "student_fee_ledgers_fee_structure_item_id_idx" ON "student_fee_ledgers"("fee_structure_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_ledgers_enrollment_id_fee_component_id_key" ON "student_fee_ledgers"("enrollment_id", "fee_component_id");

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_fee_structure_id_fkey" FOREIGN KEY ("fee_structure_id") REFERENCES "fee_structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_ledgers" ADD CONSTRAINT "student_fee_ledgers_fee_structure_item_id_fkey" FOREIGN KEY ("fee_structure_item_id") REFERENCES "fee_structure_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_installments" ADD CONSTRAINT "fee_installments_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "student_fee_ledgers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "student_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_received_by_id_fkey" FOREIGN KEY ("received_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payment_items" ADD CONSTRAINT "fee_payment_items_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "fee_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payment_items" ADD CONSTRAINT "fee_payment_items_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "student_fee_ledgers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payment_items" ADD CONSTRAINT "fee_payment_items_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "fee_installments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "fee_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_generated_by_id_fkey" FOREIGN KEY ("generated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_last_printed_by_id_fkey" FOREIGN KEY ("last_printed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_sequences" ADD CONSTRAINT "receipt_sequences_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
