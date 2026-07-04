import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { getAuth } from 'firebase-admin/auth';

export const syncUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    // Upsert user in Mongo
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $set: { isOnline: true, lastSeen: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    return res.status(200).json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Error in syncUser:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const searchQuery = req.query.q as string;
    if (!searchQuery) return res.status(400).json({ error: 'Search query is required' });

    // Fetch users from Firebase (up to 1000 for simplicity in this small app)
    const listUsersResult = await getAuth().listUsers(1000);
    
    // Filter locally by display name or email
    const matchedFirebaseUsers = listUsersResult.users.filter(u => {
      const nameMatch = u.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || emailMatch;
    });

    // Fetch online status from MongoDB for these specific users
    const uids = matchedFirebaseUsers.map(u => u.uid);
    const mongoUsers = await User.find({ firebaseUid: { $in: uids } });

    // Merge data
    const result = matchedFirebaseUsers.map(fbUser => {
      const mongoUser = mongoUsers.find(mu => mu.firebaseUid === fbUser.uid);
      return {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Unknown User',
        photoURL: fbUser.photoURL || '',
        isOnline: mongoUser ? mongoUser.isOnline : false,
        lastSeen: mongoUser ? mongoUser.lastSeen : null
      };
    });

    // Filter out the current user making the request
    const filteredResult = result.filter(u => u.uid !== req.user?.uid);

    return res.status(200).json(filteredResult);
  } catch (error) {
    console.error('Error in searchUsers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
