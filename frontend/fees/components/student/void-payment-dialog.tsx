'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle } from 'lucide-react';

interface VoidPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  receiptNumber: string;
}

export function VoidPaymentDialog({ isOpen, onClose, onConfirm, receiptNumber }: VoidPaymentDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (reason.trim().length < 5) return;
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-rose-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Void Payment Record
          </DialogTitle>
          <DialogDescription>
            You are about to cancel receipt <strong className="text-foreground">{receiptNumber}</strong>. 
            This will restore the student's dues to their previous state. This action is audited.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Reason for Cancellation <span className="text-rose-500">*</span>
            </label>
            <Input 
              placeholder="e.g., Cheque bounced, entered incorrect amount..." 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
            {reason.length > 0 && reason.length < 5 && (
              <p className="text-[10px] text-rose-500 mt-1">Reason must be at least 5 characters.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting || reason.trim().length < 5}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirm Void
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}