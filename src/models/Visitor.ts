import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  passId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  designation?: string;
  passType: string;
  eventName: string;
  eventId: mongoose.Types.ObjectId;
  organizerId: mongoose.Types.ObjectId;
  status: 'pending' | 'entered' | 'cancelled';
  enteredAt?: Date;
  createdAt: Date;
}

const VisitorSchema: Schema = new Schema({
  passId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  designation: { type: String },
  passType: { type: String, default: 'Visitor' },
  eventName: { type: String },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  enteredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Visitor = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);
