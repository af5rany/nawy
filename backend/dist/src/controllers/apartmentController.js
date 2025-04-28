"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApartment = exports.updateApartment = exports.createApartment = exports.getApartment = exports.listApartments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Apartment_1 = __importDefault(require("../Models/Apartment"));
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// CLOUDINARY_URL=cloudinary://668673788526413:3l4KoSRT7YNRKIWO6itxWEc2N1I@dg4l2eelg
// Upload a Multer file to Cloudinary via Data URI
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;
    const result = yield cloudinary_1.v2.uploader.upload(dataUri, {
        folder: 'apartments',
    });
    return result.secure_url;
});
/**
 * GET /api/apartments
 */
const listApartments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, minPrice, maxPrice, rooms } = req.query;
        const filter = {};
        // ... existing filter logic ...
        const apartments = yield Apartment_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json(apartments);
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
exports.listApartments = listApartments;
/**
 * GET /api/apartments/:id
 */
const getApartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid apartment ID format.' });
            return;
        }
        const apartment = yield Apartment_1.default.findById(id);
        if (!apartment) {
            res.status(404).json({ message: 'Apartment not found.' });
            return;
        }
        res.status(200).json(apartment);
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
exports.getApartment = getApartment;
/**
 * POST /api/apartments
 * Use multer.upload.array('images') to populate req.files
 */
const createApartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const images = [];
        if (files && files.length) {
            for (const file of files) {
                const url = yield uploadToCloudinary(file);
                images.push(url);
            }
        }
        const { unitName, unitNumber, description, location, price, area, rooms } = req.body;
        const locationObj = typeof location === 'string' ? JSON.parse(location) : location;
        const newApt = new Apartment_1.default({
            unitName,
            unitNumber,
            description,
            location: locationObj,
            price: Number(price),
            area: Number(area),
            rooms: Number(rooms),
            images,
        });
        const saved = yield newApt.save();
        res.status(201).json(saved);
        return;
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message);
            res.status(400).json({ message: 'Validation failed.', errors });
            return;
        }
        next(err);
        return;
    }
});
exports.createApartment = createApartment;
/**
 * PATCH /api/apartments/:id
 */
const updateApartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid apartment ID format.' });
            return;
        }
        const files = req.files;
        if (files && files.length) {
            const uploaded = [];
            for (const file of files) {
                uploaded.push(yield uploadToCloudinary(file));
            }
            req.body.images = uploaded;
        }
        if (req.body.location &&
            typeof req.body.location === 'string') {
            req.body.location = JSON.parse(req.body.location);
        }
        const apt = yield Apartment_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!apt) {
            res.status(404).json({ message: 'Apartment not found.' });
            return;
        }
        res.status(200).json(apt);
        return;
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message);
            res.status(400).json({ message: 'Validation failed.', errors });
            return;
        }
        next(err);
        return;
    }
});
exports.updateApartment = updateApartment;
/**
 * DELETE /api/apartments/:id
 */
const deleteApartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid apartment ID format.' });
            return;
        }
        const result = yield Apartment_1.default.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({ message: 'Apartment not found.' });
            return;
        }
        res.status(200).json({ message: 'Apartment deleted successfully.' });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
exports.deleteApartment = deleteApartment;
