import { Droppable } from "react-beautiful-dnd";
import TaskCard from "../TaskCard";
import "./TaskSection.css";
import { useKanbanContext } from "../../contexts/KanbanContext";

function TaskSection({ title, status, tasks, onAddTask }) {
  let columnMessage = "";
  const columnTasks = tasks.filter((task) => task.status === status);

  // Column-specific messages
  if (status === "todo") {
    columnMessage = "No tasks in To do. Add a new task!";
  } else if (status === "in-progress") {
    columnMessage = "Move tasks here when you start with a task!";
  } else if (status === "completed") {
    columnMessage = "Completed tasks go here!";
  } else {
    columnMessage = "This column is empty. Start by adding tasks!";
  }
  const { setIsModalOpen, setIsAddingTask } = useKanbanContext();

  function handleNewTaskBtnClick() {
    setIsModalOpen(true);
    setIsAddingTask(true);
  }

  return (
    <div className={`task-section ${status}`}>
      <h2>{title}</h2>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            className={`task-list ${
              snapshot.isDraggingOver ? "dragging-over" : ""
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Render tasks if available */}
            {columnTasks.length > 0 ? (
              columnTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))
            ) : (
              // Show the empty column message when no tasks in column
              <div className="empty-column-message">
                <p>{columnMessage}</p>
                {status === "todo" && (
                  <button
                    className="add-task-column-button"
                    onClick={handleNewTaskBtnClick}
                    aria-label="Add new task"
                  >
                    Add Task
                  </button>
                )}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskSection;
