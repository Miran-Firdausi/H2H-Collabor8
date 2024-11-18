import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import NewChatModal from './NewChatModal';
import './Chat.css';

const ChatPage = ({ userId }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChats();
    fetchDefaultAIChat();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chats/my_chats/');
      setChats(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to load chats.');
    }
  };

  const fetchDefaultAIChat = async () => {
    try {
      const response = await axios.post('/api/chats/create_or_get_ai_chat/');
      if (response && response.data) {
        setChats((prevChats) => {
          if (!prevChats.some((chat) => chat.id === response.data.id)) {
            return [...prevChats, response.data];
          }
          return prevChats;
        });
      }
    } catch (error) {
      console.error('Error fetching default AI chat:', error);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.participants?.some((p) =>
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = async (chatData) => {
    try {
      let response;
      if (chatData.is_ai_chat) {
        response = await axios.post('/api/chats/create_or_get_ai_chat/');
      } else if (chatData.is_group_chat) {
        response = await axios.post('/api/chats/', chatData);
      } else {
        response = await axios.post('/api/chats/create_or_get_private_chat/', {
          user_id: chatData.participants[0],
        });
      }

      if (response && response.data) {
        if (!chats.some((chat) => chat.id === response.data.id)) {
          setChats((prevChats) => [...prevChats, response.data]);
        }
        setSelectedChat(response.data);
      }

      setShowNewChatModal(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat.');
    }
  };

  return (
    <div className="chat-container">
      {error && <div className="error-message">{error}</div>}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Chats</h2>
          <button
            className="new-chat-button"
            onClick={() => setShowNewChatModal(true)}
          >
            New Chat
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ChatList
          chats={filteredChats}
          onSelectChat={handleChatSelect}
          selectedChatId={selectedChat?.id}
        />
      </div>
      <div className="chat-main">
        {selectedChat ? (
          <ChatRoom
            chatId={selectedChat.id}
            userId={userId}
            isAiChat={selectedChat.is_ai_chat}
          />
        ) : (
          <div className="no-chat-selected">Select a chat and start messaging</div>
        )}
      </div>
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleNewChat}
          userId={userId}
        />
      )}
    </div>
  );
};

export default ChatPage;
