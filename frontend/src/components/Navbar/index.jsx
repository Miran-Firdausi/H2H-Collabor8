import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageCircleMore, Layout, Bell, User, Users } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <img className="logo-img" src="/skillmingle-logo.jpg" />
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
              <Bell size={20} />
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
