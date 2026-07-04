import { useState, useEffect } from 'react';
import { UserPlus, Search, X } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { userService } from '../../services/userService';
import type { Conversation, ChatUser } from '../../utils/types';
import ChatListItem from './ChatListItem';

interface ChatListProps {
  activeConversationId?: string;
  onChatSelect: (chat: Conversation) => void;
}

export default function ChatList({ activeConversationId, onChatSelect }: ChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const results = await userService.searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed', error);
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleStartChat = async (userId: string) => {
    try {
      const newConv = await chatService.createConversation(userId);
      setSearchQuery('');
      setIsSearching(false);
      
      const updatedList = await chatService.getConversations();
      setConversations(updatedList);
      
      const found = updatedList.find(c => c._id === newConv._id);
      if (found) onChatSelect(found);
    } catch (error) {
      console.error('Failed to start chat', error);
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-list__header">
        <div className="chat-list__header-top">
          <h2>Messages</h2>
          <button title="New Chat" onClick={() => fetchConversations()}>
            <UserPlus size={20} />
          </button>
        </div>
        <div className="chat-list__search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X size={16} style={{ cursor: 'pointer', color: 'var(--chat-text-clr-2)' }} onClick={() => setSearchQuery('')} />
          )}
        </div>
      </div>

      <div className="chat-list__items">
        {isSearching ? (
          searchResults.map(user => (
            <ChatListItem
              key={user.uid}
              avatarUrl={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
              title={user.displayName}
              subtitle={user.email}
              isOnline={user.isOnline}
              onClick={() => handleStartChat(user.uid)}
            />
          ))
        ) : conversations.length === 0 ? (
           <div style={{ padding: '20px', textAlign: 'center', color: 'var(--chat-text-clr-2)' }}>No conversations yet. Search for a user to start!</div>
        ) : (
          conversations.map(chat => (
            <ChatListItem
              key={chat._id}
              avatarUrl={chat.otherParticipant?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.otherParticipant?.uid}`}
              title={chat.otherParticipant?.displayName || 'Unknown'}
              subtitle={chat.lastMessage?.text}
              time={chat.lastMessage ? new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : undefined}
              isOnline={chat.otherParticipant?.isOnline}
              isActive={activeConversationId === chat._id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
}
