interface ChatListItemProps {
  avatarUrl: string;
  title: string;
  subtitle?: string;
  time?: string;
  isOnline?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

export default function ChatListItem({
  avatarUrl,
  title,
  subtitle,
  time,
  isOnline,
  isActive,
  onClick
}: ChatListItemProps) {
  return (
    <div 
      className={`chat-list__item ${isActive ? 'chat-list__item--active' : ''}`}
      onClick={onClick}
    >
      <div className={`chat-list__avatar ${isOnline ? 'chat-list__avatar--online' : ''}`}>
        <img src={avatarUrl} alt="Avatar" />
      </div>
      <div className="chat-list__content">
        <div className="chat-list__top">
          <h4>{title}</h4>
          {time && <span>{time}</span>}
        </div>
        {subtitle && <p className="chat-list__preview">{subtitle}</p>}
      </div>
    </div>
  );
}
