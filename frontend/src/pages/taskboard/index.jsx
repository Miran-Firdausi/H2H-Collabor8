import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Board.css";

const Board = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectNameDefault = params.get("name");
  // Calculate initial position for each task in a grid layout
  const calculatePosition = (index) => {
    const SPACING = 220; // Width of sticky note plus margin
    const VERTICAL_SPACING = 250; // Height of sticky note plus margin
    const ITEMS_PER_ROW = 4; // Number of items per row

    const row = Math.floor(index / ITEMS_PER_ROW);
    const col = index % ITEMS_PER_ROW;

    return {
      x: 50 + col * SPACING,
      y: 100 + row * VERTICAL_SPACING,
    };
  };
  useEffect(() => {
    const savedTasks = localStorage.getItem("stickyNotes");
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      // Apply calculated positions to saved tasks
      const positionedTasks = parsed.map((task, index) => ({
        ...task,
        position: calculatePosition(index),
      }));
      setTasks(positionedTasks);
      localStorage.removeItem("stickyNotes");
    }
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskPosition = calculatePosition(tasks.length);
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          content: newTask,
          position: newTaskPosition,
        },
      ]);
      setNewTask("");
    }
  };

  const updateTask = (id, newContent) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, content: newContent } : task
      )
    );
  };

  const moveTask = (id, newPosition) => {
    // Adjust position to account for any scrolling
    const adjustedPosition = {
      x: newPosition.x + window.scrollX,
      y: newPosition.y + window.scrollY,
    };

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, position: adjustedPosition } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (id) => {
    setEditingTask(id);
  };

  const stopEditing = () => {
    setEditingTask(null);
  };

  return (
    <div>
      <div className="board-header">
        <h2 className="title">{projectNameDefault ? projectNameDefault : "Sticky Board"}</h2>
      </div>
      <div className="miro-board">
        <form onSubmit={addTask} className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <button type="submit">Add</button>
        </form>
        <div className="board">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="sticky-note"
              style={{
                left: task.position.x,
                top: task.position.y,
                position: "absolute",
              }}
              draggable
              onDragEnd={(e) => {
                e.preventDefault();
                moveTask(task.id, { x: e.clientX, y: e.clientY });
              }}
            >
              {editingTask === task.id ? (
                <input
                  type="text"
                  value={task.content}
                  onChange={(e) => updateTask(task.id, e.target.value)}
                  onBlur={stopEditing}
                  autoFocus
                />
              ) : (
                <>
                  <p onClick={() => startEditing(task.id)}>{task.content}</p>
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
