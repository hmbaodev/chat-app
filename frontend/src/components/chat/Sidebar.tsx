import { MessageCircle, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="chat-sidebar">
      {/* Primary Navigation */}
      <div className="chat-sidebar__icon chat-sidebar__icon--active">
        <MessageCircle size={24} />
      </div>
      <div className="chat-sidebar__icon">
        <Users size={24} />
      </div>

      {/* Bottom Actions */}
      <div className="chat-sidebar__bottom">
        <div className="chat-sidebar__icon" onClick={() => logout()} title="Logout">
          <LogOut size={24} />
        </div>
      </div>
    </aside>
  );
}
