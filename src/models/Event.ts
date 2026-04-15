import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  slug: string;
  date: string;
  venue: string;
  description?: string;
  organizerId: string;
  settings: {
    showCompany: boolean;
    showDesignation: boolean;
    showPhone: boolean;
  };
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String },
  organizerId: { type: String, required: true },
  settings: {
    showCompany: { type: Boolean, default: true },
    showDesignation: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Event = (mongoose.models.Event as mongoose.Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);
