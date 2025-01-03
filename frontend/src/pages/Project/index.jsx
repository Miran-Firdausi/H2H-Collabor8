import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CheckSquare,
  Layout,
  Folder,
  Github as GithubIcon,
  Calendar as CalendarIcon,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Tasks from "../ToDo";
import Board from "../taskboard";
import Files from "../Files";
import Github from "../GithubDashboard";
import Calendar from "../Calendar";
import AdminDashboard from "../AdminDashboard";

import "./Project.css";

function Project() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tab || "tasks");
  
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get("name");
  const projectId = queryParams.get("id");

  const tabs = [
    { name: "tasks", icon: <CheckSquare />, label: "Tasks" },
    { name: "board", icon: <Layout />, label: "Board" },
    { name: "files", icon: <Folder />, label: "Files" },
    { name: "github", icon: <GithubIcon />, label: "Github" },
    { name: "calendar", icon: <CalendarIcon />, label: "Calendar" },
    { name: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" }
  ];

  useEffect(() => {
    if (tab && tabs.find((t) => t.name === tab.toLowerCase())) {
      setActiveTab(tab.toLowerCase());
    } else if (!tab) {
      navigate(`/project/tasks?id=${projectId}&name=${encodeURIComponent(projectName)}`);
    }
  }, [tab, navigate, projectName, projectId, tabs]);

  const handleTabChange = (tabName) => {
    const newTab = tabName.toLowerCase();
    setActiveTab(newTab);
    navigate(`/project/${newTab}?id=${projectId}&name=${encodeURIComponent(projectName)}`);
  };

  const renderContent = () => {
    
    const componentProps = { projectName, projectId };
    
    switch (activeTab) {
      case "tasks":
        return <Tasks {...componentProps} />;
      case "board":
        return <Board {...componentProps} />;
      case "files":
        return <Files {...componentProps} />;
      case "github":
        return <Github {...componentProps} />;
      case "calendar":
        return <Calendar {...componentProps} />;
      case "dashboard":
        return <AdminDashboard {...componentProps} />;
      default:
        return <div>Select a tab to view content.</div>;
    }
  };


  useEffect(() => {
    if (!projectName || !projectId) {
      navigate('/login');
    }
  }, [projectName, projectId, navigate]);

  if (!projectName || !projectId) {
    return null; 
  }

  return (
    <div className="project-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <button
          className="toggle-btn"
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        >
          {isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={activeTab === tab.name ? "active" : ""}
            >
              {tab.icon}
              {isSidebarExpanded && <span>{tab.label}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default Project;