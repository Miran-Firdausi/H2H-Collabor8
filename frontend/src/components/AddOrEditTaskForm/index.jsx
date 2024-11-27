import React, { useState, useEffect } from "react";
import { useKanbanContext } from "../../contexts/KanbanContext";
import { AlertCircle } from "lucide-react";
import "./AddOrEditTaskForm.css";

// List of assignees (you can modify as needed)
const assignees = [
  { id: 1, name: "Alice", color: "#FF6B6B" },
  { id: 2, name: "Bob", color: "#4ECDC4" },
  { id: 3, name: "Charlie", color: "#FFD93D" },
];

function AddOrEditTaskModal() {
  const {
    newTask,
    editingTask,
    setNewTask,
    addTask,
    updateTask,
    setIsModalOpen,
    onClose,
    getAvailableTasksForDependency,
  } = useKanbanContext();

  const [selectedAssignee, setSelectedAssignee] = useState(null);

  // If editing an existing task, pre-populate the form with its details
  useEffect(() => {
    if (editingTask) {
      setSelectedAssignee(editingTask.assignee);
      setNewTask({
        ...editingTask,
        name: editingTask.name,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        dependencies: editingTask.dependencies,
      });
    } else {
      // For a new task, reset the form
      setNewTask({
        name: "",
        description: "",
        dueDate: "",
        priority: 1,
        assignee: null,
        dependencies: [],
      });
    }
  }, [editingTask, setNewTask]);

  const handleTaskSubmit = () => {
    if (editingTask) {
      // Update the existing task
      updateTask(editingTask.id, newTask);
    } else {
      // Add a new task
      addTask();
    }
    setIsModalOpen(false); // Close the modal after submitting
  };

  return (
    <div className="add-task-form-container">
      <h2>{editingTask ? "Edit Task" : "Create a New Task"}</h2>
      <div className="add-task-form-row">
        <div className="add-task-form-column">
          {/* Task Name */}
          <div className="add-task-form-group">
            <label htmlFor="task-name">Task Name</label>
            <input
              id="task-name"
              type="text"
              value={newTask.name}
              placeholder="Task summary"
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="add-task-input text-input"
            />
          </div>

          {/* Task Description */}
          <div className="add-task-form-group">
            <label htmlFor="task-desc">Task Description (Optional)</label>
            <textarea
              id="task-desc"
              value={newTask.description}
              rows={9}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Enter task description"
              style={{ resize: "none" }}
              className="add-task-input text-input"
            />
          </div>
        </div>
        <div className="add-task-form-column">
          {/* Due Date */}
          <div className="add-task-form-group">
            <label htmlFor="due-date">Due Date</label>
            <input
              id="due-date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="add-task-input date-input"
            />
          </div>

          {/* Priority */}
          <div className="add-task-form-group">
            <label htmlFor="priority">Priority (1-5)</label>
            <input
              id="priority"
              type="number"
              min="1"
              max="5"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: parseInt(e.target.value) })
              }
              className="add-task-input number-input"
            />
          </div>

          {/* Assignee */}
          <div className="add-task-form-group">
            <label htmlFor="assignee">Assign To</label>
            <select
              id="assignee"
              value={selectedAssignee ? selectedAssignee.id : ""}
              onChange={(e) => {
                const assignee = assignees.find(
                  (assignee) => assignee.id === parseInt(e.target.value)
                );
                setSelectedAssignee(assignee);
                setNewTask({ ...newTask, assignee });
              }}
              className="add-task-input dropdown-input"
            >
              <option value="" disabled>
                Select Assignee
              </option>
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
            {selectedAssignee && (
              <div className="add-task-assignee-display">
                <span
                  className="add-task-assignee-circle"
                  style={{ backgroundColor: selectedAssignee.color }}
                >
                  {selectedAssignee.name[0]}
                </span>
                {selectedAssignee.name}
              </div>
            )}
          </div>

          {/* Dependencies */}
          <div className="add-task-form-group add-task-dependency-section">
            <span className="task-dependencies-title">Task Dependencies</span>
            <div className="add-task-dependency-list">
              {getAvailableTasksForDependency(newTask.id).length === 0 ? (
                <p className="no-tasks-message">There are no tasks yet.</p>
              ) : (
                getAvailableTasksForDependency(newTask.id).map((task) => (
                  <div key={task.id} className="add-task-dependency-item">
                    <input
                      type="checkbox"
                      id={`dep-${task.id}`}
                      checked={newTask.dependencies?.includes(task.id) || false}
                      onChange={(e) => {
                        const newDependencies = e.target.checked
                          ? [...(newTask.dependencies || []), task.id]
                          : newTask.dependencies.filter((id) => id !== task.id);
                        setNewTask({
                          ...newTask,
                          dependencies: newDependencies,
                        });
                      }}
                    />
                    <label htmlFor={`dep-${task.id}`}>{task.name}</label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dependency Warning for Editing Task */}
        {editingTask && newTask.dependencies.length > 0 && (
          <div className="dependency-warning">
            <AlertCircle size={14} />
            <span>
              This task cannot be started until its dependencies are in progress
              or completed.
            </span>
          </div>
        )}
      </div>

      {/* Modal Buttons */}
      <div className="add-task-modal-buttons">
        <button onClick={handleTaskSubmit} className="btn-primary ">
          {editingTask ? "Save Changes" : "Add Task"}
        </button>
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddOrEditTaskModal;
