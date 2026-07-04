import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Conversation } from '../models/Conversation';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { User } from '../models/User';

export const createConversation = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user?.uid;
    const { receiverId } = req.body;

    if (!currentUserId || !receiverId) {
      return res.status(400).json({ error: 'Missing user IDs' });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [currentUserId, receiverId] }
    }).populate('lastMessage');

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      participants: [currentUserId, receiverId]
    });

    await newConversation.save();
    return res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user?.uid;
    if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

    const conversations = await Conversation.find({
      participants: currentUserId
    }).populate('lastMessage').sort({ updatedAt: -1 });

    const participantUids = new Set<string>();
    conversations.forEach(c => {
      c.participants.forEach(pUid => {
        if (pUid !== currentUserId) {
          participantUids.add(pUid);
        }
      });
    });

    const uidArray = Array.from(participantUids).map(uid => ({ uid }));
    
    let firebaseUsers: UserRecord[] = [];
    if (uidArray.length > 0) {
      const getResult = await getAuth().getUsers(uidArray);
      firebaseUsers = getResult.users;
    }

    const mongoUsers = await User.find({ firebaseUid: { $in: Array.from(participantUids) } });

    const enrichedConversations = conversations.map(c => {
      const otherParticipantUid = c.participants.find(p => p !== currentUserId);
      const fbUser = firebaseUsers.find(u => u.uid === otherParticipantUid);
      const mUser = mongoUsers.find(u => u.firebaseUid === otherParticipantUid);

      return {
        _id: c._id,
        participants: c.participants,
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
        otherParticipant: {
          uid: otherParticipantUid,
          displayName: fbUser?.displayName || 'Unknown User',
          photoURL: fbUser?.photoURL || '',
          isOnline: mUser?.isOnline || false,
          lastSeen: mUser?.lastSeen || null
        }
      };
    });

    return res.status(200).json(enrichedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
