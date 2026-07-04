import { Router } from 'express';
import { syncUser, searchUsers } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/sync', verifyToken, syncUser);
router.get('/search', verifyToken, searchUsers);

export default router;
