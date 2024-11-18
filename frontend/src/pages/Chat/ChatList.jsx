import React from 'react';

const ChatList = ({ chats, onSelectChat, selectedChatId }) => {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-item ${chat.id === selectedChatId ? 'selected' : ''}`}
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-name">
            {chat.is_ai_chat
              ? 'AI Assistant'
              : chat.name || chat.participants.map((p) => p.username).join(', ')}
          </div>
          {chat.last_message && (
            <div className="last-message">
              <span className="sender">{chat.last_message.sender.username}: </span>
              <span className="content">{chat.last_message.content}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
