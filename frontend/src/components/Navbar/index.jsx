import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore, Layout, Bell, User, Users } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [isSignedIn] = useState(true);
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <img className="logo-img" src="/skillmingle-logo.jpg" />
          <span>Colabor8</span>
        </Link>

        {isSignedIn ? (
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
              <Bell size={20} />
              <span>Notifications</span>
            </Link>
            <Link to="/share" className="nav-link">
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
