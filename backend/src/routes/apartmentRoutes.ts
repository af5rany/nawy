import { Router } from 'express';
import multer from 'multer';
import {
  listApartments,
  getApartment,
  createApartment,
  updateApartment,
  deleteApartment,
} from '../controllers/apartmentController';

const router = Router();

const upload = multer();

router.get('/', listApartments);
router.get('/:id', getApartment);
router.post('/', upload.array('images'), createApartment);
router.patch('/:id', upload.array('images'), updateApartment);
router.delete('/:id', deleteApartment);

export default router;
