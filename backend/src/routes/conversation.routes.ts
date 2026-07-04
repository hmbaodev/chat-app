import { Router } from 'express';
import { createConversation, getConversations } from '../controllers/conversation.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', verifyToken, createConversation);
router.get('/', verifyToken, getConversations);

export default router;
