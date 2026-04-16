import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IEvent extends Document {
  organizerId: Types.ObjectId
  name: string
  date: string | Date
  endDate?: string | Date
  venue: string
  slug: string
  description?: string
  capacity?: number
  registrationOpen: boolean
  logoUrl?: string
  passTypes: string[]
  passSettings: {
    showName: boolean
    showDesignation: boolean
    showPhone: boolean
    showCompany: boolean
    customBackgroundUrl?: string
    qrPosition?: number // Percentage from top
    infoPosition?: number // Percentage from top
  }
  checkinPin?: string
  createdAt: Date
}

const EventSchema = new Schema<IEvent>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer' },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  venue: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  capacity: { type: Number },
  registrationOpen: { type: Boolean, default: true },
  logoUrl: { type: String },
  passTypes: [{ type: String, default: ['Visitor', 'VIP', 'Speaker'] }],
  passSettings: {
    showName: { type: Boolean, default: true },
    showDesignation: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: false },
    showCompany: { type: Boolean, default: true },
    customBackgroundUrl: { type: String },
    qrPosition: { type: Number, default: 40 },
    infoPosition: { type: Number, default: 65 }
  },
  checkinPin: { type: String, default: '1234' },
  createdAt: { type: Date, default: Date.now },
})

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
