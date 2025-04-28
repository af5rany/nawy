import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import Apartment from '../Models/Apartment';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// CLOUDINARY_URL=cloudinary://668673788526413:3l4KoSRT7YNRKIWO6itxWEc2N1I@dg4l2eelg

// Upload a Multer file to Cloudinary via Data URI
const uploadToCloudinary = async (
  file: Express.Multer.File,
): Promise<string> => {
  const base64 = file.buffer.toString('base64');
  const dataUri = `data:${file.mimetype};base64,${base64}`;
  const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder: 'apartments',
  });
  return result.secure_url;
};

/**
 * GET /api/apartments
 */
export const listApartments: RequestHandler = async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice, rooms } = req.query;
    const filter: any = {};
    // ... existing filter logic ...
    const apartments = await Apartment.find(filter).sort({ createdAt: -1 });
    res.status(200).json(apartments);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * GET /api/apartments/:id
 */
export const getApartment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid apartment ID format.' });
      return;
    }
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      res.status(404).json({ message: 'Apartment not found.' });
      return;
    }
    res.status(200).json(apartment);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * POST /api/apartments
 * Use multer.upload.array('images') to populate req.files
 */
export const createApartment: RequestHandler = async (req, res, next) => {
  try {
    const files = (req as any).files as Express.Multer.File[] | undefined;
    const images: string[] = [];
    if (files && files.length) {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        images.push(url);
      }
    }
    const { unitName, unitNumber, description, location, price, area, rooms } =
      req.body as any;
    const locationObj =
      typeof location === 'string' ? JSON.parse(location) : location;

    const newApt = new Apartment({
      unitName,
      unitNumber,
      description,
      location: locationObj,
      price: Number(price),
      area: Number(area),
      rooms: Number(rooms),
      images,
    });

    const saved = await newApt.save();
    res.status(201).json(saved);
    return;
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ message: 'Validation failed.', errors });
      return;
    }
    next(err);
    return;
  }
};

/**
 * PATCH /api/apartments/:id
 */
export const updateApartment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid apartment ID format.' });
      return;
    }
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files && files.length) {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await uploadToCloudinary(file));
      }
      (req.body as any).images = uploaded;
    }
    if (
      (req.body as any).location &&
      typeof (req.body as any).location === 'string'
    ) {
      (req.body as any).location = JSON.parse((req.body as any).location);
    }

    const apt = await Apartment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!apt) {
      res.status(404).json({ message: 'Apartment not found.' });
      return;
    }
    res.status(200).json(apt);
    return;
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ message: 'Validation failed.', errors });
      return;
    }
    next(err);
    return;
  }
};

/**
 * DELETE /api/apartments/:id
 */
export const deleteApartment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid apartment ID format.' });
      return;
    }
    const result = await Apartment.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ message: 'Apartment not found.' });
      return;
    }
    res.status(200).json({ message: 'Apartment deleted successfully.' });
    return;
  } catch (err) {
    next(err);
    return;
  }
};
