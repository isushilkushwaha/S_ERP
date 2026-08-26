-- CreateTable
CREATE TABLE "installment_plan_item_components" (
    "id" TEXT NOT NULL,
    "installment_plan_item_id" TEXT NOT NULL,
    "fee_component_id" TEXT NOT NULL,

    CONSTRAINT "installment_plan_item_components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "installment_plan_item_components_installment_plan_item_id_idx" ON "installment_plan_item_components"("installment_plan_item_id");

-- CreateIndex
CREATE INDEX "installment_plan_item_components_fee_component_id_idx" ON "installment_plan_item_components"("fee_component_id");

-- CreateIndex
CREATE UNIQUE INDEX "installment_plan_item_components_installment_plan_item_id_f_key" ON "installment_plan_item_components"("installment_plan_item_id", "fee_component_id");

-- AddForeignKey
ALTER TABLE "installment_plan_item_components" ADD CONSTRAINT "installment_plan_item_components_installment_plan_item_id_fkey" FOREIGN KEY ("installment_plan_item_id") REFERENCES "installment_plan_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plan_item_components" ADD CONSTRAINT "installment_plan_item_components_fee_component_id_fkey" FOREIGN KEY ("fee_component_id") REFERENCES "fee_components"("id") ON DELETE CASCADE ON UPDATE CASCADE;
