import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  organizerEmail: string;
  planId: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: 'success' | 'failed';
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  organizerEmail: { type: String, required: true, index: true },
  planId: { type: String, required: true },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  razorpaySignature: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = (mongoose.models.Transaction as mongoose.Model<ITransaction>) || mongoose.model<ITransaction>('Transaction', TransactionSchema);
