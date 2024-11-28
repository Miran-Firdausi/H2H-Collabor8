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
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getConfig } from "../../utils/httpConfig";
import "./ProjectDashboard.css";

const ProjectsDashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableStatus = ["active", "completed", "archived"];
  const [status, setStatus] = useState(availableStatus[0]);

  const config = getConfig();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/projects/",
        config
      );
      setProjects(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load projects. Please try again.");
      if (error.response?.status === 401) {
        // Handle unauthorized access
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/projects/${projectId}/`,
        config
      );
      setProjects(projects.filter((project) => project.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    }
  };

  // Create project
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    try {
      const newProject = {
        name: newProjectName,
        description: newProjectDescription,
        status: status,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/projects/",
        newProject,
        config
      );
      setProjects([...projects, response.data]);
      setShowNewProjectDialog(false);
      setNewProjectName("");
      setNewProjectDescription("");
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project");
      console.error("Error creating project:", error);
    }
  };

  // Update project status
  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/projects/${projectId}/`,
        { status: newStatus },
        config
      );

      setProjects(
        projects.map((project) =>
          project.id === projectId ? { ...project, status: newStatus } : project
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={24} />
        <p>{error}</p>
        <button onClick={fetchProjects} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

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

        {projects.length === 0 ? (
          <div className="no-projects">
            <Folder size={48} />
            <h2>No projects yet</h2>
            <p>Create your first project to get started</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const createdAt = new Date(project.created_at);
              const formattedDate = createdAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return (
                <div key={project.id} className="project-card">
                  <div className="project-card-header">
                    <div className="project-title">
                      <Folder className="icon-blue" size={20} />
                      <h2>{project.name}</h2>
                    </div>
                    <div className="project-date">
                      <span>Created on: {formattedDate}</span>
                      {project.owner_name && (
                        <span className="owner">
                          Owner: {project.owner_name}
                        </span>
                      )}
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
                      className={`status-select status-${project.status}`}
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
        )}
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
                <textarea
                  className="descp"
                  placeholder="Brief project description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {availableStatus.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption.charAt(0).toUpperCase() +
                        statusOption.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dialog-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNewProjectDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
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
