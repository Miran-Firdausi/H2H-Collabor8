import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import React Router hooks
import {
  CheckSquare,
  Layout,
  Folder,
  Github as GithubIcon,
  Calendar as CalendarIcon,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"; // Import icons

import Tasks from "../ToDo";
import Board from "../taskboard";
import Files from "../Files";
import Github from "../GithubDashboard";
import Calendar from "../Calendar";
import AdminDashboard from "../AdminDashboard";

import "./Project.css";

function Project() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { tab } = useParams(); // Get the 'tab' parameter from the URL
  const navigate = useNavigate(); // React Router hook to programmatically navigate
  const [activeTab, setActiveTab] = useState(tab || "Tasks"); // Set initial tab based on URL

  const tabs = [
    { name: "Tasks", icon: <CheckSquare /> },
    { name: "Board", icon: <Layout /> },
    { name: "Files", icon: <Folder /> },
    { name: "Github", icon: <GithubIcon /> },
    { name: "Calendar", icon: <CalendarIcon /> },
    { name: "Dashboard", icon: <LayoutDashboard /> },
  ];

  useEffect(() => {
    // Update activeTab whenever the URL changes
    if (tab && tabs.find((t) => t.name.toLowerCase() === tab.toLowerCase())) {
      setActiveTab(tab);
    } else if (!tab) {
      // Default to "Tasks" if no tab is provided
      navigate("/project/tasks");
    }
  }, [tab, navigate, tabs]);

  const handleTabChange = (name) => {
    console.log(activeTab);
    setActiveTab(name);
    navigate(`/project/${name.toLowerCase()}`); // Update the URL when a tab is clicked
  };

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <Tasks />;
      case "board":
        return <Board />;
      case "files":
        return <Files />;
      case "github":
        return <Github />;
      case "calendar":
        return <Calendar />;
      case "dashboard":
        return <AdminDashboard />;
      default:
        return <div>Select a tab to view content.</div>;
    }
  };

  return (
    <div className="project-container">
      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}
      >
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
              className={activeTab === tab.name.toLowerCase() ? "active" : ""}
            >
              {tab.icon}
              {isSidebarExpanded && <span>{tab.name}</span>}
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
