import React, { useState, useEffect, useCallback } from "react";
import "./Share.css";

const Share = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  //   const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/projects/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Handling search filter
  // useEffect(() => {
  //     if (searchTerm) {
  //         const results = projects.filter(project =>
  //             project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //             project.description.toLowerCase().includes(searchTerm.toLowerCase())
  //         );
  //         setFilteredProjects(results);
  //     } else {
  //         setFilteredProjects(projects);
  //     }
  // }, [searchTerm, projects]);

  const filteredProjects = [{ name: "Hemlo", description: "asd", id: 1 }];

  const handleShareProject = useCallback(async (projectId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/share/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.message) {
        alert(`${data.message} Shared project ID: ${data.shared_project}`);
      } else {
        alert("Error sharing the project");
      }
    } catch (error) {
      console.error("Error sharing project:", error);
    }
  }, []);

  return (
    <div className="share-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="projects-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <button onClick={() => handleShareProject(project.id)}>
                Share Project
              </button>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Share;
