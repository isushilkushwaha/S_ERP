'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ReceiptPrint } from './receipt-print';

interface ReceiptPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: any;
}

export function ReceiptPreviewDialog({
  isOpen,
  onClose,
  receiptData,
}: ReceiptPreviewDialogProps) {
  if (!receiptData) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          w-[calc(100vw-1rem)]
          max-w-4xl
          max-h-[96vh]
          overflow-hidden
          p-0
          gap-0
          rounded-xl
          border
          bg-background
          shadow-2xl
        "
      >
        {/* Preview Header */}
        <div
          className="
            flex
            min-h-14
            items-center
            justify-between
            border-b
            bg-muted/30
            px-4
            sm:px-6
          "
        >
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
              Fee Receipt Preview
            </h2>

            <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
              Review the receipt before printing
            </p>
          </div>
        </div>

        {/* Receipt Preview Area */}
        <div
          className="
            max-h-[calc(96vh-3.5rem)]
            overflow-y-auto
            bg-muted/20
            p-3
            sm:p-5
            lg:p-8
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-3xl
              overflow-hidden
              rounded-lg
              bg-white
              shadow-md
              ring-1
              ring-black/5
            "
          >
            <ReceiptPrint
              receiptData={receiptData}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}