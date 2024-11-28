import React, { useState, useEffect } from "react";
import axios from "axios";
import { getConfig } from "../../utils/httpConfig";

const NewChatModal = ({ onClose, onCreateChat, userId }) => {
  const [chatType, setChatType] = useState("ai"); // Default to AI Chat
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/",
          getConfig()
        );
        if (Array.isArray(response.data)) {
          setAvailableUsers(response.data.filter((user) => user.id !== userId));
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Error fetching users: Unexpected data format");
          setAvailableUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again.");
        setAvailableUsers([]);
      }
    };
    fetchUsers();
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let chatData;

    if (chatType === "group") {
      chatData = {
        is_group_chat: true,
        name: groupName,
        participants: selectedUsers.map((user) => user.id),
      };
    } else if (chatType === "individual") {
      chatData = {
        is_group_chat: false,
        participants: [selectedUsers[0]?.id],
      };
    } else if (chatType === "ai") {
      chatData = { is_ai_chat: true };
    }
    onCreateChat(chatData);
    onClose(); // Close modal after chat creation
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="new-chat-modal" onClick={onClose}>
      <div
        className="new-chat-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Start New Chat</h2>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="new-chat-types">
            <label>
              <input
                type="radio"
                value="ai"
                checked={chatType === "ai"}
                onChange={() => setChatType("ai")}
              />
              AI Chat
            </label>
            <label>
              <input
                type="radio"
                value="individual"
                checked={chatType === "individual"}
                onChange={() => setChatType("individual")}
              />
              Individual Chat
            </label>
            <label>
              <input
                type="radio"
                value="group"
                checked={chatType === "group"}
                onChange={() => setChatType("group")}
              />
              Group Chat
            </label>
          </div>
          {chatType === "group" && (
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          )}
          {chatType !== "ai" && (
            <>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="user-list">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="user-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedUsers.some((u) => u.id === user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((u) => u.id !== user.id)
                            );
                          }
                        }}
                      />
                      {user.email}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
          <button
            className="btn-primary"
            type="submit"
            disabled={
              (chatType !== "ai" && selectedUsers.length === 0) ||
              (chatType === "group" && !groupName)
            }
          >
            Create Chat
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;
