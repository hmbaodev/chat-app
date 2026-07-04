export interface ChatUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isOnline: boolean;
  lastSeen: string | null;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: any; 
  updatedAt: string;
  otherParticipant: ChatUser;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  readBy: string[];
  createdAt: string;
}
