import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Layout, Github, Calendar, User, MessageSquare, Users } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [isSignedIn] = useState(true);
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <span>Colabor8</span>
        </Link>

        {isSignedIn ? (
          <div className="nav-links">
            <Link to="/projects" className="nav-link">
              <Layout size={20} />
              <span>Projects</span>
            </Link>
            <Link to="/todo" className="nav-link">
              <CheckSquare size={20} />
              <span>Todo</span>
            </Link>
            <Link to="/board" className="nav-link">
              <Layout size={20} />
              <span>Board</span>
            </Link>
            <Link to="/gitboard" className="nav-link">
              <Github size={20} />
              <span>GitHub</span>
            </Link>
            <Link to="/calendar" className="nav-link">
              <Calendar size={20} />
              <span>Calendar</span>
            </Link>
            <Link to="/chat" className="nav-link">
                <MessageSquare size={20} />
                <span>Chat</span>
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
