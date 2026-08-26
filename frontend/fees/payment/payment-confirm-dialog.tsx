'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  paymentDetails: {
    studentName: string;
    admissionNumber: string;
    amountPaid: number;
    paymentMethod: string;
  };
}

export function PaymentConfirmDialog({ isOpen, onClose, onConfirm, isLoading, paymentDetails }: PaymentConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment Submission</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Student:</span>
            <span className="font-semibold">{paymentDetails.studentName} ({paymentDetails.admissionNumber})</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="font-semibold">{paymentDetails.paymentMethod}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Amount to Receive:</span>
            <span className="font-bold text-emerald-600">₹{paymentDetails.amountPaid.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            This action will generate a sequential official receipt and immediately update the student ledger balances.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Review Again
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirm & Save Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}