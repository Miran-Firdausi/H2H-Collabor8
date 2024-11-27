import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckSquare,
  Layout,
  Github,
  Calendar,
  ArrowRight,
  Folder,
  File,
  Trash,
} from "lucide-react";
import axios from "axios";

import "./ProjectDashboard.css";

const ProjectsDashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const availableStatus = ["active", "completed", "archived"];
  const [status, setStatus] = useState(availableStatus[0]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/projects/")
      .then((response) => {
        setProjects(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the projects!", error);
      });
  }, []);
  const handleDeleteProject = (projectId) => {
    axios
      .delete(`http://127.0.0.1:8000/projects/${projectId}/`)
      .then(() => {
        // Filter out the deleted project from the projects list
        setProjects(projects.filter((project) => project.id !== projectId));
      })
      .catch((error) =>
        console.error("There was an error deleting the project!", error)
      );
  };
  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        name: newProjectName,
        description: newProjectDescription,
        status: status,
      };

      axios
        .post("http://127.0.0.1:8000/projects/", newProject)
        .then((response) => {
          setProjects([...projects, response.data]);
          setShowNewProjectDialog(false);
          setNewProjectName("");
          setNewProjectDescription("");
        })
        .catch((error) => {
          console.error("There was an error creating the project!", error);
        });
    }
  };

  const handleStatusChange = (projectId, newStatus) => {
    axios
      .patch(`http://127.0.0.1:8000/projects/${projectId}/`, {
        status: newStatus,
      })
      .then((response) => {
        setProjects(
          projects.map((project) =>
            project.id === projectId
              ? { ...project, status: newStatus }
              : project
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the status!", error);
      });
  };

  return (
    <div className="projects-dashboard">
      <div className="projects-dashboard-container">
        <div className="projects-dashboard-header">
          <div>
            <h1>My Projects</h1>
            <p>Manage and access all your projects</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewProjectDialog(true)}
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const createdAt = new Date(project.created_at);
            const day = createdAt.getDate().toString().padStart(2, "0");
            const month = (createdAt.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = createdAt.getFullYear();
            return (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <div className="project-title">
                    <Folder className="icon-blue" size={20} />
                    <h2>{project.name}</h2>
                  </div>
                  <div className="project-date">
                    Created on: {day}-{month}-{year}
                    <button
                      className="btn btn-outline btn-dashboard"
                      onClick={() =>
                        (window.location.href = `/AdminDashboard?project=${
                          project.id
                        }&name=${encodeURIComponent(project.name)}`)
                      }
                    >
                      <ArrowRight size={16} />
                      Dashboard
                    </button>
                  </div>
                </div>
                <div className="project-card-content">
                  <p className="project-description">{project.description}</p>
                  <select
                    value={project.status}
                    onChange={(e) =>
                      handleStatusChange(project.id, e.target.value)
                    }
                  >
                    {availableStatus.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption.charAt(0).toUpperCase() +
                          statusOption.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="project-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        (window.location.href = `/project/tasks?name=${encodeURIComponent(
                          project.name
                        )}`)
                      }
                    >
                      <CheckSquare size={16} />
                      Tasks
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        (window.location.href = `/project/board?name=${encodeURIComponent(
                          project.name
                        )}`)
                      }
                    >
                      <Layout size={16} />
                      Board
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        (window.location.href = `/project/github?name=${encodeURIComponent(
                          project.name
                        )}`)
                      }
                    >
                      <Github size={16} />
                      GitHub
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        (window.location.href = `/project/calendar?name=${encodeURIComponent(
                          project.name
                        )}`)
                      }
                    >
                      <Calendar size={16} />
                      Calendar
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        (window.location.href = `/project/files?name=${encodeURIComponent(
                          project.name
                        )}`)
                      }
                    >
                      <File size={16} />
                      Files
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNewProjectDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h2>Create New Project</h2>
              <p>Add a new project to organize your work</p>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Brief project description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="dialog-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNewProjectDialog(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsDashboard;
