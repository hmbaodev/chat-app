import { useState, useEffect, useContext, useRef } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import { chatService } from '../../services/chatService';
import type { Conversation, Message } from '../../utils/types';
import { useSocket } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';

interface ChatWindowProps {
  conversation: Conversation | null;
  onBack?: () => void;
}

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { socket, isConnected } = useSocket();
  const { currentUser } = useContext(AuthContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      chatService.getMessages(conversation._id).then(setMessages);
      if (socket && isConnected) {
        socket.emit('join_chat', conversation._id);
      }
    }
  }, [conversation, socket, isConnected]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('receive_message', (newMsg: Message) => {
        if (conversation && newMsg.conversationId === conversation._id) {
          setMessages(prev => {
            // Prevent duplicates (Socket.io sometimes emits to sender too quickly)
            if (prev.find(m => m._id === newMsg._id)) return prev;
            return [...prev, newMsg];
          });
        }
      });
      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, isConnected, conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !conversation || !socket || !isConnected) return;
    
    socket.emit('send_message', {
      conversationId: conversation._id,
      text: inputText.trim()
    });
    
    setInputText('');
  };

  if (!conversation) {
    return (
      <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--chat-text-clr-2)' }}>Select a conversation to start chatting</p>
      </div>
    );
  }

  const otherUser = conversation.otherParticipant;

  return (
    <div className='chat-window'>
      <header className='chat-window__header'>
        <div className='chat-window__header-left'>
          <button className="chat-window__back-btn" onClick={onBack}>
            <ChevronLeft size={24} />
          </button>
          <div className={`chat-list__avatar ${otherUser?.isOnline ? 'chat-list__avatar--online' : ''}`}>
            <img src={otherUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.uid}`} alt='Avatar' />
          </div>
          <div className='chat-window__user-info'>
            <h3>{otherUser?.displayName}</h3>
            <p>{otherUser?.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </header>

      <div className='chat-window__messages'>
        {messages.map(msg => {
          const isSent = msg.senderId === currentUser?.uid;
          return (
            <div key={msg._id} className={`message-bubble ${isSent ? 'message-bubble--sent' : 'message-bubble--received'}`}>
              <div className='message-bubble__content' style={{ marginLeft: isSent ? 0 : '10px' }}>
                <div className='message-bubble__text'>{msg.text}</div>
                <div className='message-bubble__meta' style={{ justifyContent: isSent ? 'flex-end' : 'flex-start', marginTop: '4px', opacity: 0.7, fontSize: '0.75rem' }}>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className='chat-window__input-area'>
        <div className='chat-window__input-wrap'>
          <input 
            type='text' 
            placeholder='Type a message...' 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                handleSend();
              }
            }}
          />
        </div>
        <button className='chat-window__send-btn' onClick={handleSend} disabled={!inputText.trim() || !isConnected}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
