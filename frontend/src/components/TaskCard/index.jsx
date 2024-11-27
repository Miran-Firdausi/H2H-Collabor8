import { Pencil, Trash2, Star, Calendar, Eye, Link } from "lucide-react";
import { format } from "date-fns";
import { Draggable } from "react-beautiful-dnd";
import { useKanbanContext } from "../../contexts/KanbanContext";
import "./TaskCard.css";

const TaskCard = ({ task, index }) => {
  const { tasks, deleteTask, setEditingTask, setIsModalOpen, setViewingTask } =
    useKanbanContext();

  const dependencyNames = task.dependencies
    .map((depId) => tasks.find((t) => t.id === depId)?.name)
    .filter(Boolean);

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${task.status}`}
        >
          <div className="task-content">
            <div className="task-row">
              <h3 className="task-name">{task.name}</h3>
              <button
                onClick={() => {
                  setEditingTask({ ...task });
                  setIsModalOpen(true);
                }}
                className="icon-button"
                aria-label="Edit task"
              >
                <Pencil size={14} />
              </button>
            </div>
            {dependencyNames.length > 0 && (
              <div className="dependencies-list">
                <Link size={12} />
                <span>Depends on: {dependencyNames.join(", ")}</span>
              </div>
            )}
            <div className="task-row">
              <div className="task-metadata">
                <span className="metadata-item">
                  <Calendar size={14} />
                  {format(new Date(task.dueDate), "MMM dd")}
                </span>
                <span className="metadata-item">
                  <Star size={14} />
                  {task.priority}
                </span>
              </div>
              <div className="task-controls">
                <button
                  onClick={() => {
                    setViewingTask(task);
                    setIsModalOpen(true);
                  }}
                  className="icon-button view"
                  aria-label="View task details"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="icon-button delete"
                  aria-label="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
