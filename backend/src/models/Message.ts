import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: String, required: true }, // Firebase UID
    text: { type: String, required: true },
    readBy: [{ type: String }] // Array of Firebase UIDs
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
