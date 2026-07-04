import { Router } from 'express';
import { getMessages } from '../controllers/message.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/:conversationId', verifyToken, getMessages);

export default router;
