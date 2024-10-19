import React, { useState } from "react";
import axios from "axios"; // Import axios

import "./Tasks.css";
import TaskCard from "../../components/TaskCard";

const Tasks = () => {
  const [mode, setMode] = useState(""); // Mode for task generation or manual entry
  const [projectTitle, setProjectTitle] = useState(""); // Project title
  const [projectDesc, setProjectDesc] = useState(""); // Project description for auto generation
  const [stickyNotes, setStickyNotes] = useState([]); // Store sticky notes

  // Handle form submission for Automated Task Generation using axios
  const handleAutoTaskSubmit = async (e) => {
    e.preventDefault();

    try {
            const response = await axios.post("http://127.0.0.1:8000/generate-tasks", {
        project_desc: projectDesc,
      });

      
      setStickyNotes(response.data.tasks);
    } catch (error) {
      console.error("Error generating tasks:", error);
    }
  };

  // Handle form submission for Manual Task Creation
  const handleAddManualTask = (task, description, daysToFinish) => {
    const newTask = { task, description, daysToFinish };
    setStickyNotes((prevNotes) => [...prevNotes, newTask]); // Add new sticky note
  };

  // Handle deleting a sticky note
  const handleDeleteNote = (index) => {
    setStickyNotes((prevNotes) => prevNotes.filter((_, i) => i !== index)); // Remove sticky note by index
  };

  return (
    <div className="tasks-page">
      <h1>Project Task Management</h1>
      
      <form className="project-form">
        <input
          type="text"
          placeholder="Enter Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          required
        />

        <div className="task-selection">
          <button
            type="button"
            onClick={() => setMode("auto")}
            className={mode === "auto" ? "active" : ""}
          >
            Automated Task Generation
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={mode === "manual" ? "active" : ""}
          >
            Manual Task Entry
          </button>
        </div>

        {/* Automated Task Generation Form */}
        {mode === "auto" && (
          <form className="automated-task-form" onSubmit={handleAutoTaskSubmit}>
            <textarea
              placeholder="Enter Project Description"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              required
            ></textarea>
            <button type="submit">Generate Tasks</button>
          </form>
        )}

        {/* Manual Task Entry */}
        {mode === "manual" && (
          <ManualTaskForm onAddTask={handleAddManualTask} />
        )}
      </form>

      {/* Display Sticky Notes (Tasks) */}
      <div className="sticky-note-wall">
        {stickyNotes.map((note, index) => (
          <TaskCard
            key={index}
            task={note.task}
            description={note.description}
            daysToFinish={note.daysToFinish}
            onUpdate={(updatedTask) => {
              const updatedNotes = [...stickyNotes];
              updatedNotes[index] = updatedTask;
              setStickyNotes(updatedNotes);
            }}
            onDelete={() => handleDeleteNote(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
