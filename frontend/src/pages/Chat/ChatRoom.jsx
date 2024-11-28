import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getConfig } from "../../utils/httpConfig";
import "./ChatRoom.css";

const ChatRoom = ({ user, chatId, isAiChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/chats/${chatId}/messages/`,
        getConfig()
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const ws_connect = () => {
    const s = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/`);

    s.onclose = (event) => {
      console.log("WebSocket closed:", event);
      // Attempt to reconnect after a delay
      setTimeout(ws_connect, 1000);
    };

    s.onerror = (error) => {
      console.error("WebSocket error observed:", error);
    };

    setSocket(s);
  };

  useEffect(() => {
    // Create WebSocket connection
    ws_connect();

    // Clean up WebSocket connection on unmount
    return () => {
      socket?.close();
    };
  }, [chatId]);

  useEffect(() => {
    if (socket == null) return;

    // Handle incoming messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket.readyState === WebSocket.OPEN) {
      // Send message via WebSocket
      socket.send(
        JSON.stringify({
          type: "chat_message",
          message_content: inputMessage,
          sender: user.id,
        })
      );
      setInputMessage(""); // Clear input field
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-room__message-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-room__message ${
              message.sender.id === user.id
                ? "chat-room__message--sent"
                : "chat-room__message--received"
            }`}
          >
            {message.sender.id !== user.id && (
              <div className="chat-room__sender-email">
                {message.sender.email}
              </div>
            )}
            {isAiChat ? (
              <div
                className="chat-room__message-content"
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            ) : (
              <div className="chat-room__message-content">
                {message.content}
              </div>
            )}
            <span className="chat-room__timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-room__message-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isAiChat ? "Ask AI a question..." : "Enter your message..."
          }
          className="chat-room__input"
        />
        <button type="submit" className="chat-room__send-button">
          Send
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ChatRoom);
