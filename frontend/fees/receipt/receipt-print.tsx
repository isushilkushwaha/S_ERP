'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, X } from 'lucide-react';

interface ReceiptPrintProps {
  receiptData: {
    school: {
      name: string;
      address: string;
      phone: string;
      email: string;
      logo?: string;
    };
    receipt: {
      receiptNumber: string;
      paymentDate: string;
      paymentMethod: string;
      transactionId?: string;
      amountPaid: number;
      discount: number;
      fine: number;
      remarks?: string;
      receivedBy: string;
    };
    student: {
      admissionNumber: string;
      studentName: string;
      fatherName: string;
      className: string;
      sectionName: string;
      academicYearName: string;
    };
    items: Array<{
      componentName: string;
      allocatedAmount: number;
    }>;
  };
  onClose?: () => void;
}

export function ReceiptPrint({ receiptData, onClose }: ReceiptPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const { school, receipt, student, items } = receiptData;

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-6 max-w-2xl mx-auto rounded-lg border shadow-lg print:border-none print:shadow-none print:p-0">
      {/* Non-Print Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b mb-6 print:hidden">
        <h2 className="text-lg font-bold">Fee Receipt Preview</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print Receipt
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Printable Receipt Area */}
      <div id="printable-receipt" className="space-y-6 bg-card p-6 rounded-md border print:border-none print:bg-transparent">
        {/* School Header */}
        <div className="text-center border-b pb-4 space-y-1">
          {school?.logo && <img src={school.logo} alt="School Logo" className="h-12 w-12 mx-auto mb-2 object-contain" />}
          <h1 className="text-xl font-extrabold tracking-tight">{school?.name || 'School Management System'}</h1>
          <p className="text-xs text-muted-foreground">{school?.address || 'Main Campus, City - PinCode'}</p>
          <p className="text-xs text-muted-foreground">Phone: {school?.phone || 'N/A'} | Email: {school?.email || 'N/A'}</p>
        </div>

        {/* Receipt Title */}
        <div className="text-center font-bold tracking-wide uppercase text-sm bg-muted py-1 rounded">
          Fee Collection Receipt
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div><span className="text-muted-foreground">Receipt No:</span> <span className="font-semibold">{receipt.receiptNumber}</span></div>
            <div><span className="text-muted-foreground">Date:</span> <span className="font-semibold">{new Date(receipt.paymentDate).toLocaleDateString('en-IN')}</span></div>
            <div><span className="text-muted-foreground">Payment Method:</span> <span className="font-semibold">{receipt.paymentMethod}</span></div>
            {receipt.transactionId && <div><span className="text-muted-foreground">Txn Ref:</span> <span className="font-semibold">{receipt.transactionId}</span></div>}
          </div>
          <div className="space-y-1 text-right">
            <div><span className="text-muted-foreground">Academic Year:</span> <span className="font-semibold">{student.academicYearName}</span></div>
            <div><span className="text-muted-foreground">Cashier:</span> <span className="font-semibold">{receipt.receivedBy}</span></div>
          </div>
        </div>

        {/* Student Details Box */}
        <div className="grid grid-cols-2 gap-2 bg-muted/30 p-3 rounded text-xs border">
          <div><span className="text-muted-foreground">Admission No:</span> <span className="font-semibold">{student.admissionNumber}</span></div>
          <div><span className="text-muted-foreground">Class / Section:</span> <span className="font-semibold">{student.className} - {student.sectionName}</span></div>
          <div><span className="text-muted-foreground">Student Name:</span> <span className="font-semibold">{student.studentName}</span></div>
          <div><span className="text-muted-foreground">Father's Name:</span> <span className="font-semibold">{student.fatherName}</span></div>
        </div>

        {/* Fee Heads Allocation Table */}
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">Fee Head Description</th>
              <th className="text-right py-2 font-semibold">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-muted/50">
                <td className="py-2">{item.componentName}</td>
                <td className="text-right py-2 font-medium">₹{item.allocatedAmount.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end pt-2 text-xs">
          <div className="w-48 space-y-1">
            {receipt.discount > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Discount Applied:</span>
                <span>-₹{receipt.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {receipt.fine > 0 && (
              <div className="flex justify-between text-amber-600">
                <span>Late Fine Added:</span>
                <span>+₹{receipt.fine.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm border-t pt-1">
              <span>Total Paid:</span>
              <span className="text-emerald-600">₹{receipt.amountPaid.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {receipt.remarks && (
          <div className="text-xs pt-2">
            <span className="text-muted-foreground">Remarks:</span> <span className="italic">{receipt.remarks}</span>
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between items-end pt-12 text-xs">
          <div>
            <div className="border-t border-foreground/50 w-32 pt-1 text-center">Receiver's Signature</div>
          </div>
          <div>
            <div className="border-t border-foreground/50 w-32 pt-1 text-center">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}