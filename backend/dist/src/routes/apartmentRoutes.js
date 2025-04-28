"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const apartmentController_1 = require("../controllers/apartmentController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/', apartmentController_1.listApartments);
router.get('/:id', apartmentController_1.getApartment);
router.post('/', upload.array('images'), apartmentController_1.createApartment);
router.patch('/:id', upload.array('images'), apartmentController_1.updateApartment);
router.delete('/:id', apartmentController_1.deleteApartment);
exports.default = router;
