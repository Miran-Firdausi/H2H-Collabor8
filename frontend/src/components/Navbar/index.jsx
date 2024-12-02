import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageCircleMore, Layout, Bell, User, Users } from "lucide-react";
import axios from "axios";
import { getConfig } from "../../utils/httpConfig";
import "./Navbar.css";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const config = getConfig();
      const response = await axios.get(
        "http://127.0.0.1:8000/notifications/count/",
        config
      );
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Failed to fetch notifications count:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();

      const pollInterval = setInterval(fetchUnreadCount, 1000);

      window.addEventListener("notificationUpdate", fetchUnreadCount);

      return () => {
        clearInterval(pollInterval);
        window.removeEventListener("notificationUpdate", fetchUnreadCount);
      };
    }
  }, [isAuthenticated]);

  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <img className="logo-img" src="/skillmingle-logo.jpg" alt="Logo" />
          <span>Colabor8</span>
        </Link>

        {isAuthenticated ? (
          <div className="nav-links">
            <Link to="/projects" className="nav-link">
              <Layout size={20} />
              <span>My Projects</span>
            </Link>
            <Link to="/chat" className="nav-link">
              <MessageCircleMore size={20} />
              <span>Chat</span>
            </Link>
            <Link to="/notifications" className="nav-link">
              <div className="notif-badge">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notif-count">{unreadCount}</span>
                )}
              </div>
              <span>Notifications</span>
            </Link>
            <Link to="/discussion" className="nav-link">
              <Users size={20} />
              <span>Discussions</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <User size={20} />
              <span>Hi, User</span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            <User size={20} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
