import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  Star,
  Calendar,
  Eye,
  Wand2,
  ArrowRight,
  Link,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ToDo.css";

const ToDo = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("To-Do");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [newTask, setNewTask] = useState({
    id: "",
    name: "",
    description: "",
    dueDate: "",
    priority: 1,
    status: "todo",
    dependencies: [], // New field for task dependencies
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAutomateModalOpen, setIsAutomateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [automateForm, setAutomateForm] = useState({
    projectName: "",
    projectDescription: "",
  });
  const handleGoToBoard = () => {
    // Convert todo tasks to sticky notes format
    const stickyNotes = tasks
      .filter((task) => task.status === "todo")
      .map((task) => ({
        id: task.id,
        content: `${task.name}\n${task.description || ""}`,
        position: { x: 50, y: 50 },
      }));

    // Store the sticky notes in localStorage for the Board component to access
    localStorage.setItem("stickyNotes", JSON.stringify(stickyNotes));

    // Navigate to the board page
    navigate("/board");
  };
  // Check if a task can be moved to a new status based on dependencies
  const canMoveTask = (task, newStatus) => {
    // If task has no dependencies, it can be moved
    if (!task.dependencies || task.dependencies.length === 0) return true;

    // Get dependent tasks
    const dependentTasks = tasks.filter((t) =>
      task.dependencies.includes(t.id)
    );

    // For starting a task, all dependencies must be at least 'todo'
    if (newStatus === "in-progress") {
      return dependentTasks.every((dt) =>
        ["todo", "in-progress", "completed"].includes(dt.status)
      );
    }

    // For completing a task, all dependencies must be completed
    if (newStatus === "completed") {
      return dependentTasks.every((dt) => dt.status === "completed");
    }

    return true;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const allTasks = [...tasks];
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceItems = allTasks.filter((task) => task.status === sourceStatus);
    const taskToMove = sourceItems[source.index];

    // Check if task can be moved to the new status
    if (!canMoveTask(taskToMove, destStatus)) {
      alert("Cannot move task: Dependent tasks are not in the right status.");
      return;
    }

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

  // Modify addTask to support dependencies
  const addTask = () => {
    if (newTask.name && newTask.dueDate) {
      setTasks([
        ...tasks,
        {
          ...newTask,
          id: Date.now().toString(),
          status: "todo",
          dependencies: newTask.dependencies || [],
        },
      ]);
      setNewTask({
        id: "",
        name: "",
        description: "",
        dueDate: "",
        priority: 1,
        status: "todo",
        dependencies: [],
      });
    }
  };

  // Modify updateTask to support dependencies
  const updateTask = (taskId, updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updatedTask,
              // Ensure dependencies don't include the task itself
              dependencies: (updatedTask.dependencies || []).filter(
                (depId) => depId !== taskId
              ),
            }
          : task
      )
    );
    setEditingTask(null);
    setIsModalOpen(false);
  };

  // Modify TaskCard to include dependency visualization
  const TaskCard = ({ task, index }) => {
    // Get dependencies for this task
    const dependencyTasks = tasks.filter((t) =>
      task.dependencies.includes(t.id)
    );

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
              {dependencyTasks.length > 0 && (
                <div className="task-dependencies">
                  <Link size={12} />
                  <span>
                    Depends on: {dependencyTasks.map((t) => t.name).join(", ")}
                  </span>
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
  };

  // Modify Edit Task Modal to support dependencies
  const renderEditTaskModal = () => {
    if (!isModalOpen || !editingTask) return null;

    return (
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
          {/* Dependency Selection */}
          <div className="dependency-selection">
            <label>Dependencies:</label>
            <select
              multiple
              value={editingTask.dependencies}
              onChange={(e) => {
                const selectedDependencies = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setEditingTask({
                  ...editingTask,
                  dependencies: selectedDependencies,
                });
              }}
              className="dependency-select"
            >
              {tasks
                .filter((t) => t.id !== editingTask.id) // Exclude current task
                .map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
            </select>
          </div>
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
    );
  };

  // Modify add task form to support dependencies
  const renderAddTaskForm = () => {
    return (
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
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
        {/* Dependencies Selection */}
        <div className="dependency-selection">
          <label>Dependencies:</label>
          <select
            multiple
            value={newTask.dependencies}
            onChange={(e) => {
              const selectedDependencies = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setNewTask({
                ...newTask,
                dependencies: selectedDependencies,
              });
            }}
            className="dependency-select"
          >
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={addTask} className="add-button">
          Add Task
        </button>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="todo-container">
        {/* Rest of the existing render logic remains the same */}

        {renderAddTaskForm()}

        {/* Existing sections container */}
        <div className="sections-container">
          <TaskSection title="To Do" status="todo" tasks={tasks} />
          <TaskSection title="In Progress" status="in-progress" tasks={tasks} />
          <TaskSection title="Completed" status="completed" tasks={tasks} />
        </div>

        {/* Edit Task Modal */}
        {renderEditTaskModal()}

        {/* Existing view and automate modals */}
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
        {isAutomateModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Automate Project Tasks</h2>
              <input
                type="text"
                placeholder="Project Name"
                value={automateForm.projectName}
                onChange={(e) =>
                  setAutomateForm({
                    ...automateForm,
                    projectName: e.target.value,
                  })
                }
                className="text-input"
              />
              <textarea
                placeholder="Project Description"
                value={automateForm.projectDescription}
                onChange={(e) =>
                  setAutomateForm({
                    ...automateForm,
                    projectDescription: e.target.value,
                  })
                }
                className="text-input description-input"
              />
              <div className="modal-buttons">
                <button onClick={handleAutomate} className="save-button">
                  Generate Tasks
                </button>
                <button
                  onClick={() => setIsAutomateModalOpen(false)}
                  className="cancel-button"
                >
                  Cancel
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
