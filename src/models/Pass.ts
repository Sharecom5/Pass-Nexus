import mongoose, { Schema, Document } from 'mongoose';

export interface IPass extends Document {
  passId: string;
  eventSlug: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  designation?: string;
  passType: 'Visitor' | 'VIP' | 'Exhibitor' | 'Speaker' | 'Press';
  status: 'active' | 'scanned' | 'cancelled';
  createdAt: Date;
}

const PassSchema = new Schema<IPass>({
  passId: { type: String, required: true, unique: true },
  eventSlug: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  designation: { type: String },
  passType: { 
    type: String, 
    enum: ['Visitor', 'VIP', 'Exhibitor', 'Speaker', 'Press'],
    default: 'Visitor' 
  },
  status: { 
    type: String, 
    enum: ['active', 'scanned', 'cancelled'],
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
});

export const Pass = (mongoose.models.Pass as mongoose.Model<IPass>) || mongoose.model<IPass>('Pass', PassSchema);
