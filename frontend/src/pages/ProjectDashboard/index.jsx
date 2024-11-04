import React, { useState } from 'react';
import { 
  Plus, 
  CheckSquare, 
  Layout, 
  Github, 
  Calendar,
  ArrowRight,
  Folder
} from 'lucide-react';
import './ProjectDashboard.css'
const ProjectsDashboard = () => {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [projects, setProjects] = useState([]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      setProjects([
        ...projects,
        {
          id: Date.now(),
          name: newProjectName,
          description: newProjectDescription,
          created: new Date().toISOString().split('T')[0]
        }
      ]);
      setShowNewProjectDialog(false);
      setNewProjectName('');
      setNewProjectDescription('');
    }
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-container">
        <div className="dashboard-header">
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

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <div className="project-title">
                  <Folder className="icon-blue" size={20} />
                  <h2>{project.name}</h2>
                </div>
                <p className="project-date">Created on {project.created}</p>
              </div>
              <div className="project-card-content">
                <p className="project-description">{project.description}</p>
                
                <div className="project-actions">
                  <button className="btn btn-outline" onClick={() => window.location.href = `/todo?project=${project.id}`}>
                    <CheckSquare size={16} />
                    Tasks
                  </button>
                  <button className="btn btn-outline" onClick={() => window.location.href = `/board?project=${project.id}`}>
                    <Layout size={16} />
                    Board
                  </button>
                  <button className="btn btn-outline" onClick={() => window.location.href = `/gitboard?project=${project.id}`}>
                    <Github size={16} />
                    GitHub
                  </button>
                  <button className="btn btn-outline" onClick={() => window.location.href = `/calendar?project=${project.id}`}>
                    <Calendar size={16} />
                    Calendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Dialog */}
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
              <button className="btn btn-outline" onClick={() => setShowNewProjectDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateProject}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsDashboard;