import React, { useEffect, useState } from "react";
import "./TaskCard.css"; // Import the CSS file

const TaskCard = ({ task, description, daysToFinish, onUpdate, onDelete }) => {
  const [bgColor, setBgColor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(task);
  const [editableDescription, setEditableDescription] = useState(description);
  const [editableDaysToFinish, setEditableDaysToFinish] = useState(daysToFinish);

  useEffect(() => {
    setBgColor(getRandomColor());
  }, []);

  const handleSave = () => {
    onUpdate({
      task: editableTask,
      description: editableDescription,
      daysToFinish: editableDaysToFinish,
    });
    setIsEditing(false);
  };

  return (
    <div className="sticky-note" style={{ backgroundColor: bgColor }}>
      {isEditing ? (
        <>
          <input
            className="task-title"
            type="text"
            value={editableTask}
            onChange={(e) => setEditableTask(e.target.value)}
          />
          <textarea
            className="task-desc"
            value={editableDescription}
            onChange={(e) => setEditableDescription(e.target.value)}
          />
          <select
            className="days-to-finish"
            value={editableDaysToFinish}
            onChange={(e) => setEditableDaysToFinish(e.target.value)}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day} days
              </option>
            ))}
          </select>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h3 className="task-title">{editableTask}</h3>
          <p className="task-desc">{editableDescription}</p>
          <p className="days-to-finish">
            {editableDaysToFinish === "Ongoing" ? "Ongoing" : `Days to finish: ${editableDaysToFinish}`}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TaskCard;
