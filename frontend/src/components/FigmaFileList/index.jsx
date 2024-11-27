import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation to `/figma/:id`
import "./FigmaFileList.css";

const FigmaFileList = () => {
  const [figmaFiles, setFigmaFiles] = useState([
    {
      id: 1,
      title: "Website Design",
      thumbnail: "/figma-thumbnail-1.png",
      figmaLink: "/",
      date: "2024-11-01",
    },
    {
      id: 2,
      title: "Mobile App Mockup",
      thumbnail: "/figma-thumbnail-2.png",
      figmaLink: "/",
      date: "2024-11-10",
    },
    {
      id: 3,
      title: "Mobile App Mockup",
      thumbnail: "/figma-thumbnail-3.png",
      figmaLink: "/",
      date: "2024-11-10",
    },
    {
      id: 4,
      title: "Mobile App Mockup",
      thumbnail: "/figma-thumbnail-4.png",
      figmaLink: "/",
      date: "2024-11-10",
    },
    {
      id: 5,
      title: "Mobile App Mockup",
      thumbnail: "/figma-thumbnail-5.png",
      figmaLink: "/",
      date: "2024-11-10",
    },
  ]);

  const [newFile, setNewFile] = useState({
    title: "",
    figmaLink: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFile({ ...newFile, [name]: value });
  };

  const addFigmaFile = () => {
    if (newFile.title && newFile.figmaLink) {
      const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
      const newFileData = {
        id: figmaFiles.length + 1,
        title: newFile.title,
        thumbnail: "https://via.placeholder.com/150", // Placeholder for now
        date: currentDate,
        figmaLink: newFile.figmaLink,
      };
      setFigmaFiles([...figmaFiles, newFileData]);
      setNewFile({ title: "", figmaLink: "" }); // Reset form fields
    } else {
      alert("Please fill out both the title and the Figma file URL.");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/project/files/figma/${id}`);
  };

  return (
    <div className="figma-file-list">
      <div className="add-new-file">
        <h2>Add New Figma File</h2>
        <input
          type="text"
          name="title"
          placeholder="File Title"
          value={newFile.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="figmaLink"
          placeholder="Figma File URL"
          value={newFile.figmaLink}
          onChange={handleInputChange}
        />
        <button onClick={addFigmaFile}>Add File</button>
      </div>
      <h2 className="figma-cards-title">Your Figma Files</h2>

      <div className="figma-cards">
        {figmaFiles.map((file) => (
          <div
            className="figma-card"
            key={file.id}
            onClick={() => handleCardClick(file.id)}
          >
            <img
              src={file.thumbnail}
              alt={file.title}
              className="figma-thumbnail"
            />
            <div className="figma-details">
              <h3>{file.title}</h3>
              <p>Date: {file.date}</p>
              <a
                href={file.figmaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent redirect to `/figma/:id`
              >
                Open Figma
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaFileList;
