//server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { errorHandler } from './src/middlewares/errorHandler';
import apartmentRoutes from './src/routes/apartmentRoutes';
import('./db');

// Server Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

// Routes
app.use('/api/apartments', apartmentRoutes);

// Global error handler
app.use(errorHandler);

// Server Listen
app.listen(PORT, (error: any) => {
  if (!error) console.log('Server is Running, and listening on port ' + PORT);
  else console.log("Error occurred, server can't start", error);
});
