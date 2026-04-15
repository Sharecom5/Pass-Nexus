import mongoose, { Schema, Document } from 'mongoose';

export interface IScanLog extends Document {
  passId: string;
  visitorName: string;
  result: 'granted' | 'denied' | 'duplicate';
  deviceInfo?: string;
  createdAt: Date;
}

const ScanLogSchema: Schema = new Schema({
  passId: { type: String, required: true },
  visitorName: { type: String },
  result: { type: String, required: true },
  deviceInfo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const ScanLog = mongoose.models.ScanLog || mongoose.model<IScanLog>('ScanLog', ScanLogSchema);
