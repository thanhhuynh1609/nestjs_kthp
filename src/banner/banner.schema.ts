import { Schema, Document } from 'mongoose';

// Định nghĩa interface cho Banner
export interface Banner extends Document {
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
  created: Date;
  updated: Date;
}

// Định nghĩa schema bằng mongoose.Schema
export const BannerSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);