import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  slug: string;
  date: string;
  venue: string;
  organizerId: mongoose.Types.ObjectId;
  description?: string;
  passTypes: string[]; // e.g., ["Visitor", "VIP", "Speaker"]
  status: 'draft' | 'active' | 'completed';
  allowMultipleEntry: boolean;
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  passTypes: { type: [String], default: ['Visitor', 'VIP', 'Guest'] },
  status: { type: String, default: 'active' },
  allowMultipleEntry: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
