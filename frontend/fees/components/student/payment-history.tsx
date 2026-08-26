'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Loader2, Ban, Info } from 'lucide-react';
import { ReceiptPreviewDialog } from '@/frontend/fees/receipt/receipt-preview-dialog';
import { toast } from 'sonner';
import { VoidPaymentDialog } from './void-payment-dialog';
import { useVoidPayment } from '@/frontend/fees/hooks/use-fees'; // Import new hook

export function PaymentHistory({ payments }: { payments: any[] }) {
  const voidMutation = useVoidPayment(); // Use centralized mutation
  
  const [loadingPaymentId, setLoadingPaymentId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [voidTarget, setVoidTarget] = useState<{ id: string; receiptNo: string } | null>(null);

  const handlePrintReceipt = async (paymentId: string) => {
    try {
      setLoadingPaymentId(paymentId);
      const res = await fetch(`/api/fees/receipts/${paymentId}`);
      const json = await res.json();
      
      if (!json.success) throw new Error(json.error);
      
      setSelectedReceipt(json.data);
    } catch (error: any) {
      toast.error('Failed to load receipt details.');
    } finally {
      setLoadingPaymentId(null);
    }
  };

  const handleExecuteVoid = async (reason: string) => {
    if (!voidTarget) return;
    try {
      await voidMutation.mutateAsync({ paymentId: voidTarget.id, reason });
      toast.success(`Receipt ${voidTarget.receiptNo} successfully voided.`);
      setVoidTarget(null);
      // No need to manually invalidate query caches here anymore! 
      // The hook's onSuccess handles it automatically.
    } catch (error: any) {
      toast.error(`Void failed: ${error.message}`);
    }
  };

  const handleVoidClick = (paymentId: string, receiptNumber: string) => {
    setVoidTarget({ id: paymentId, receiptNo: receiptNumber });
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-card">
        <Info className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No payment history recorded for this student yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Receipt & Date</TableHead>
            <TableHead>Payment Details</TableHead>
            <TableHead>Allocations</TableHead>
            <TableHead className="text-right">Amount (₹)</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/60">
          {payments.map((p) => {
            const isVoided = p.status === 'CANCELLED' || p.status === 'REFUNDED';
            
            return (
              <TableRow key={p.paymentId} className={`hover:bg-muted/20 transition-colors ${isVoided ? 'opacity-60 bg-rose-50/10' : ''}`}>
                
                {/* Receipt & Date */}
                <TableCell>
                  <div className="font-semibold text-blue-600">{p.receiptNumber}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.paymentDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">By: {p.receivedBy}</div>
                </TableCell>
                
                {/* Payment Method & Ref */}
                <TableCell>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] font-mono">{p.paymentMethod}</Badge>
                  </div>
                  {p.transactionId && (
                    <div className="text-xs text-muted-foreground font-mono">Ref: {p.transactionId}</div>
                  )}
                  {p.remarks && (
                    <div className="text-xs text-muted-foreground italic truncate max-w-[150px]" title={p.remarks}>
                      "{p.remarks}"
                    </div>
                  )}
                </TableCell>

                {/* Allocated Heads */}
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {p.allocatedHeads?.map((head: any, idx: number) => (
                      <span key={idx} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        {head.componentName}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Amount Paid */}
                <TableCell className="text-right">
                  <div className={`font-bold ${isVoided ? 'text-muted-foreground line-through' : 'text-emerald-600'}`}>
                    ₹{p.amountPaid.toLocaleString('en-IN')}
                  </div>
                  {(p.discount > 0 || p.fine > 0) && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {p.discount > 0 && <span className="text-blue-500 mr-2">-₹{p.discount}</span>}
                      {p.fine > 0 && <span className="text-amber-500">+₹{p.fine}</span>}
                    </div>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <Badge variant={isVoided ? 'destructive' : 'default'} className="text-[10px]">
                    {p.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handlePrintReceipt(p.paymentId)}
                      disabled={loadingPaymentId === p.paymentId || voidMutation.isPending}
                      title="View/Print Receipt"
                    >
                      {loadingPaymentId === p.paymentId ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Printer className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                      )}
                    </Button>
                    
                    {!isVoided && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleVoidClick(p.paymentId, p.receiptNumber)}
                        title="Void Payment"
                        disabled={voidMutation.isPending}
                        className="hover:bg-rose-100 hover:text-rose-600"
                      >
                        {voidMutation.isPending && voidTarget?.id === p.paymentId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="h-4 w-4 text-rose-500" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
                
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Render the printable receipt modal when a receipt is loaded */}
      {selectedReceipt && (
        <ReceiptPreviewDialog
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receiptData={selectedReceipt}
        />
      )}

      {/* Render the Void Confirmation Modal */}
      {voidTarget && (
        <VoidPaymentDialog
          isOpen={!!voidTarget}
          onClose={() => setVoidTarget(null)}
          receiptNumber={voidTarget.receiptNo}
          onConfirm={handleExecuteVoid}
        />
      )}
    </div>
  );
}