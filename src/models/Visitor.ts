import mongoose, { Schema, Document } from 'mongoose'

export interface IVisitor extends Document {
  passId: string
  name: string
  email: string
  phone?: string
  company?: string
  passType: 'VIP' | 'Speaker' | 'Press' | 'Exhibitor' | 'Visitor' | 'Instant Badge'
  status: 'registered' | 'entered' | 'cancelled'
  qrCodeUrl?: string
  passImageUrl?: string
  passPdfUrl?: string
  eventId?: mongoose.Types.ObjectId
  eventName?: string
  eventDate?: string
  eventVenue?: string
  designation?: string
  address?: string
  organizerId?: mongoose.Types.ObjectId | string
  createdAt: Date
  enteredAt?: Date
  scanCount: number
  otp?: string
  otpExpiry?: Date
}

const VisitorSchema = new Schema<IVisitor>({
  passId:       { type: String, required: true, unique: true, index: true },
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, trim: true },
  phone:        { type: String, trim: true },
  company:      { type: String, trim: true },
  passType:     { type: String, enum: ['Visitor','Speaker','VIP','Press','Exhibitor','Instant Badge'], default: 'Visitor' },
  status:       { type: String, enum: ['registered','entered','cancelled'], default: 'registered' },
  qrCodeUrl:    { type: String },
  passImageUrl: { type: String },
  passPdfUrl:   { type: String },
  eventId:      { type: Schema.Types.ObjectId, ref: 'Event' },
  eventName:    { type: String },
  eventDate:    { type: String },
  eventVenue:   { type: String },
  designation:  { type: String, trim: true },
  address:      { type: String, trim: true },
  organizerId:  { type: Schema.Types.ObjectId, ref: 'Organizer' },
  createdAt:    { type: Date, default: Date.now },
  enteredAt:    { type: Date },
  scanCount:    { type: Number, default: 0 },
  otp:          { type: String },
  otpExpiry:    { type: Date },
})

// Compound index: Email must be unique per Event, but allowed across different Events
VisitorSchema.index({ email: 1, eventId: 1 }, { unique: true });

export const Visitor = (mongoose.models.Visitor as mongoose.Model<IVisitor>) || mongoose.model<IVisitor>('Visitor', VisitorSchema)
