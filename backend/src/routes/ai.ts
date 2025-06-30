import express from 'express';
import { askAI } from '../controllers/aiController';

const router = express.Router();
router.post('/', askAI);
export default router; 