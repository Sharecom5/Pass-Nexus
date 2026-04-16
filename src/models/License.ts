import mongoose, { Schema, Document } from 'mongoose';

export interface ILicense extends Document {
  key: string;
  domain: string;
  expiryDate: Date;
  active: boolean;
  createdAt: Date;
}

const LicenseSchema = new Schema<ILicense>({
  key: { type: String, required: true, unique: true },
  domain: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const License = mongoose.models.License || mongoose.model<ILicense>('License', LicenseSchema);
