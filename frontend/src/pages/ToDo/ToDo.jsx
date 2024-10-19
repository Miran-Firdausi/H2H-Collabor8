import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Pencil, Trash2, ArrowUpDown, Star, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import "./ToDo.css";

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    id: "",
    name: "",
    description: "",
    dueDate: "",
    priority: 1,
    status: "todo",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  const addTask = () => {
    if (newTask.name && newTask.dueDate) {
      setTasks([
        ...tasks,
        { ...newTask, id: Date.now().toString(), status: "todo" },
      ]);
      setNewTask({
        id: "",
        name: "",
        description: "",
        dueDate: "",
        priority: 1,
        status: "todo",
      });
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const updateTask = (taskId, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSort = (type) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (type === "priority") {
        return b.priority - a.priority;
      } else if (type === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
    setTasks(sortedTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const allTasks = [...tasks];
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceItems = allTasks.filter((task) => task.status === sourceStatus);
    const taskToMove = sourceItems[source.index];

    const newTasks = allTasks.filter((task) => task.id !== taskToMove.id);
    taskToMove.status = destStatus;

    const tasksInDestination = newTasks.filter(
      (task) => task.status === destStatus
    );
    tasksInDestination.splice(destination.index, 0, taskToMove);

    const finalTasks = newTasks
      .filter((task) => task.status !== destStatus)
      .concat(tasksInDestination);

    setTasks(finalTasks);
  };

  const TaskCard = ({ task, index }) => (
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
                    setIsViewModalOpen(true);
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

  const TaskSection = ({ title, status, tasks }) => (
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
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="todo-container">
        <h1>To-Do</h1>

        <div className="controls">
          <button
            onClick={() => handleSort("priority")}
            className="sort-button"
          >
            <ArrowUpDown size={16} /> Sort by Priority
          </button>
          <button onClick={() => handleSort("dueDate")} className="sort-button">
            <ArrowUpDown size={16} /> Sort by Due Date
          </button>
        </div>

        <div className="add-task-form">
          <input
            type="text"
            placeholder="Task name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="text-input"
          />
          <input
            type="text"
            placeholder="Task description (optional)"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="text-input"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="date-input"
          />
          <input
            type="number"
            placeholder="Priority (1-5)"
            min="1"
            max="5"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: parseInt(e.target.value) })
            }
            className="number-input"
          />
          <button onClick={addTask} className="add-button">
            Add Task
          </button>
        </div>

        <div className="sections-container">
          <TaskSection
            title="To Do"
            status="todo"
            tasks={tasks.filter((task) => task.status === "todo")}
          />
          <TaskSection
            title="In Progress"
            status="in-progress"
            tasks={tasks.filter((task) => task.status === "in-progress")}
          />
          <TaskSection
            title="Completed"
            status="completed"
            tasks={tasks.filter((task) => task.status === "completed")}
          />
        </div>

        {isModalOpen && editingTask && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Task</h2>
              <input
                type="text"
                placeholder="Task name"
                value={editingTask.name}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, name: e.target.value })
                }
                className="text-input"
              />
              <textarea
                placeholder="Task description (optional)"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
                className="text-input description-input"
              />
              <input
                type="date"
                value={editingTask.dueDate}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, dueDate: e.target.value })
                }
                className="date-input"
              />
              <input
                type="number"
                placeholder="Priority (1-5)"
                min="1"
                max="5"
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    priority: parseInt(e.target.value),
                  })
                }
                className="number-input"
              />
              <div className="modal-buttons">
                <button
                  onClick={() => updateTask(editingTask.id, editingTask)}
                  className="save-button"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isViewModalOpen && viewingTask && (
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
        )}
      </div>
    </DragDropContext>
  );
};

export default ToDo;
