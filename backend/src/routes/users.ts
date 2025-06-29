import express from 'express';
import { createUser } from '../controllers/usersController';

const router = express.Router();

router.post('/', createUser);

router.get('/', (req, res) => {
  res.json({ message: 'Route users OK' });
});

export default router; 