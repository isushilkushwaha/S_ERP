-- CreateEnum
CREATE TYPE "FeeInstallmentStatus" AS ENUM ('DUE', 'PARTIAL', 'PAID', 'OVERDUE');

-- AlterTable
ALTER TABLE "fee_installments" ADD COLUMN     "status" "FeeInstallmentStatus" NOT NULL DEFAULT 'DUE';

-- AlterTable
ALTER TABLE "fee_payments" ADD COLUMN     "void_reason" VARCHAR(255),
ADD COLUMN     "voided_at" TIMESTAMP(3),
ADD COLUMN     "voided_by_id" TEXT;

-- CreateIndex
CREATE INDEX "fee_installments_status_idx" ON "fee_installments"("status");

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_voided_by_id_fkey" FOREIGN KEY ("voided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
