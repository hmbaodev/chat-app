import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__left">
        <div className="auth-layout__brand">
          <div className="auth-layout__logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="var(--chat-brand-clr-1)"/>
            </svg>
            <h2>ChatApp</h2>
          </div>
          <h1>Connect with friends, instantly.</h1>
          <p>Join the conversation and experience real-time messaging with a beautiful, modern interface.</p>
        </div>
        <div className="auth-layout__graphics">
           <div className="glass-card"></div>
           <div className="glass-circle"></div>
        </div>
      </div>
      <div className="auth-layout__right">
        <div className="auth-layout__form-container">
          {(title || subtitle) && (
            <div className="auth-layout__form-header">
              {title && <h3>{title}</h3>}
              {subtitle && <p>{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
