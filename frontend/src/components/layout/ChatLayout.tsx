import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
  mobileView?: 'list' | 'chat';
}

export default function ChatLayout({ children, mobileView = 'list' }: ChatLayoutProps) {
  return (
    <div className={`chat-app chat-app--mobile-${mobileView}`}>
      {children}
    </div>
  );
}
