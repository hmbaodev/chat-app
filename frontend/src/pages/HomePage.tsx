import { useState } from 'react';
import ChatLayout from '../components/layout/ChatLayout';
import Sidebar from '../components/chat/Sidebar';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import type { Conversation } from '../utils/types';

export default function HomePage() {
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const handleChatSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMobileView('chat');
  };

  return (
    <ChatLayout mobileView={mobileView}>
      <Sidebar />
      <ChatList 
        activeConversationId={activeConversation?._id}
        onChatSelect={handleChatSelect} 
      />
      <ChatWindow 
        conversation={activeConversation}
        onBack={() => setMobileView('list')} 
      />
    </ChatLayout>
  );
}
