import React from "react";
import { format } from "date-fns";
import { Link } from "lucide-react";
import { useKanbanContext } from "../../contexts/KanbanContext";

function ViewTaskModal() {
  const { tasks, viewingTask, setIsViewModalOpen } = useKanbanContext();
  return (
    <div className="modal-overlay">
      <div className="modal view-modal">
        <h2>Task Details</h2>
        <div className="task-details">
          <h3>Name</h3>
          <p>{viewingTask.name}</p>

          <h3>Description</h3>
          <p>{viewingTask.description || "No description provided"}</p>

          <h3>Due Date</h3>
          <p>{format(new Date(viewingTask.dueDate), "MMMM dd, yyyy")}</p>

          <h3>Priority</h3>
          <p>{viewingTask.priority}</p>

          <h3>Status</h3>
          <p className="status-text">{viewingTask.status}</p>

          <h3>Dependencies</h3>
          {viewingTask.dependencies.length > 0 ? (
            <div className="dependency-view-list">
              {viewingTask.dependencies.map((depId) => {
                const depTask = tasks.find((t) => t.id === depId);
                return depTask ? (
                  <div key={depId} className="dependency-view-item">
                    <Link size={14} />
                    <span>{depTask.name}</span>
                    <span className={`status-badge ${depTask.status}`}>
                      {depTask.status}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p>No dependencies</p>
          )}
        </div>
        <div className="modal-buttons">
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="cancel-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewTaskModal;
