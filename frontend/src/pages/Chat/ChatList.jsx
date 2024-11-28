import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { load_user } from "../../actions/auth";
import "./ChatList.css";

const ChatList = ({ chats, onSelectChat, selectedChatId }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser) {
      dispatch(load_user());
    }
  }, [dispatch, currentUser]);

  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = (now - date) / (1000 * 60);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${Math.floor(diffMinutes)} min ago`;
    if (diffMinutes < 24 * 60)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    return date.toLocaleDateString();
  };

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-list__item ${
            chat.id === selectedChatId ? "chat-list__item--selected" : ""
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-list__name">
            {chat.is_ai_chat
              ? "AI Assistant"
              : chat.name ||
                chat.participants.find((p) => p.id !== currentUser?.id)?.name}
          </div>
          {chat.last_message && (
            <div className="chat-list__last-message">
              <span className="chat-list__content">
                {chat.last_message.content}
              </span>
              <span className="chat-list__timestamp">
                {chat.last_message.timestamp
                  ? formatRelativeTime(chat.last_message.timestamp)
                  : ""}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
