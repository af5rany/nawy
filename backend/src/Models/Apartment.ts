import mongoose, { Schema, Document } from 'mongoose';

export interface IApartment extends Document {
  unitName: string;
  unitNumber: string;
  description: string;
  location: {
    address: string;
    city: string;
  };
  price: number;
  area: number;
  rooms: number;
  images: string[];
}

const ApartmentSchema = new Schema<IApartment>(
  {
    unitName: { type: String, required: true },
    unitNumber: { type: String, required: true },
    description: { type: String },
    location: {
      address: { type: String },
      city: { type: String },
    },
    price: { type: Number, required: true },
    area: { type: Number },
    rooms: { type: Number },
    images: { type: [String], default: [] },
  },
  { timestamps: true },
);

// text index for search
ApartmentSchema.index({
  unitName: 'text',
  unitNumber: 'text',
});

export default mongoose.model<IApartment>('Apartment', ApartmentSchema);
