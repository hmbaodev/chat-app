import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';

export const getMessages = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user?.uid;
    const { conversationId } = req.params;

    if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    if (!conversation.participants.includes(currentUserId)) {
      return res.status(403).json({ error: 'Not a participant of this conversation' });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
