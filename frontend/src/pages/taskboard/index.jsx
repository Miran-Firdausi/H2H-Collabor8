import React, { useState, useEffect } from 'react';
import './Board.css';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), content: newTask, position: { x: 50, y: 50 } }]);
      setNewTask('');
    }
  };

  const updateTask = (id, newContent) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, content: newContent } : task));
  };

  const moveTask = (id, newPosition) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, position: newPosition } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (id) => {
    setEditingTask(id);
  };

  const stopEditing = () => {
    setEditingTask(null);
  };

  return (
    <div>
      <div><h2 className='title'>Sticky Board</h2></div>  
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
            style={{ left: task.position.x, top: task.position.y }}
            draggable
            onDragEnd={(e) => moveTask(task.id, { x: e.clientX, y: e.clientY })}
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
                <button className="edit-btn" onClick={() => startEditing(task.id)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
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