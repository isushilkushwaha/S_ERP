'use client';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  PaymentMethodType,
} from '../types/fee-payment.types';

interface PaymentMethodFieldsProps {
  paymentMethod: PaymentMethodType;

  transactionId: string;
  chequeNumber: string;
  bankName: string;
  chequeDate: string;
  cardType: string;
  remarks: string;

  onMethodChange: (
    value: PaymentMethodType,
  ) => void;

  onTransactionIdChange: (
    value: string,
  ) => void;

  onChequeNumberChange: (
    value: string,
  ) => void;

  onBankNameChange: (
    value: string,
  ) => void;

  onChequeDateChange: (
    value: string,
  ) => void;

  onCardTypeChange: (
    value: string,
  ) => void;

  onRemarksChange: (
    value: string,
  ) => void;
}

export function PaymentMethodFields({
  paymentMethod,

  transactionId,
  chequeNumber,
  bankName,
  chequeDate,
  cardType,
  remarks,

  onMethodChange,

  onTransactionIdChange,
  onChequeNumberChange,
  onBankNameChange,
  onChequeDateChange,
  onCardTypeChange,
  onRemarksChange,
}: PaymentMethodFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Payment Method *
        </label>

        <Select
          value={paymentMethod}
          onValueChange={(value) =>
            onMethodChange(
              value as PaymentMethodType,
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="CASH">
              Cash
            </SelectItem>

            <SelectItem value="UPI">
              UPI
            </SelectItem>

            <SelectItem value="CHEQUE">
              Cheque
            </SelectItem>

            <SelectItem value="CARD">
              Card
            </SelectItem>

            <SelectItem value="BANK_TRANSFER">
              Bank Transfer
            </SelectItem>

            <SelectItem value="RAZORPAY">
              Razorpay
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(paymentMethod === 'UPI' ||
        paymentMethod === 'BANK_TRANSFER' ||
        paymentMethod === 'CARD') && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            {paymentMethod === 'CARD'
              ? 'Authorization Code *'
              : 'Transaction ID / UTR *'}
          </label>

          <Input
            value={transactionId}
            onChange={(event) =>
              onTransactionIdChange(
                event.target.value,
              )
            }
          />
        </div>
      )}

      {paymentMethod === 'BANK_TRANSFER' && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Bank Name *
          </label>

          <Input
            value={bankName}
            onChange={(event) =>
              onBankNameChange(
                event.target.value,
              )
            }
          />
        </div>
      )}

      {paymentMethod === 'CHEQUE' && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Cheque Number *
            </label>

            <Input
              value={chequeNumber}
              onChange={(event) =>
                onChequeNumberChange(
                  event.target.value,
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bank Name *
            </label>

            <Input
              value={bankName}
              onChange={(event) =>
                onBankNameChange(
                  event.target.value,
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Cheque Date *
            </label>

            <Input
              type="date"
              value={chequeDate}
              onChange={(event) =>
                onChequeDateChange(
                  event.target.value,
                )
              }
            />
          </div>
        </div>
      )}

      {paymentMethod === 'CARD' && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Card Type *
          </label>

          <Select
  value={cardType}
  onValueChange={(value) => {
    if (value !== null) {
      onCardTypeChange(value);
    }
  }}
>
            <SelectTrigger>
              <SelectValue placeholder="Select card type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="DEBIT">
                Debit Card
              </SelectItem>

              <SelectItem value="CREDIT">
                Credit Card
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Remarks / Notes
        </label>

        <Input
          value={remarks}
          maxLength={255}
          onChange={(event) =>
            onRemarksChange(
              event.target.value,
            )
          }
          placeholder="Optional"
        />
      </div>
    </div>
  );
}