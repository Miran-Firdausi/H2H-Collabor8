import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoom = ({ chatId, userId, isAiChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // poll new messages every 5 seconds
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages/`);
      setMessages(response.data.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      try {
        await axios.post(`/api/chats/${chatId}/send_message/`, { content: inputMessage });
        setInputMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-room">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender.id === userId ? 'sent' : 'received'}`}>
            <strong>{message.sender.username}: </strong>
            {message.content}
            <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isAiChat ? "Ask AI a question..." : "Type a message..."}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;