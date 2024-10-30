/* eslint-disable react/prop-types */
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setIsDropdownOpen(false);
  };

  const handleAutomate = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-tasks/",
        {
          project_desc: automateForm.projectDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      setProjectName(automateForm.projectName);
      setTasks([]);

      const generatedTasks = response.data.tasks.map((task) => {
        const currentDate = new Date();
        const dueDate = addDays(currentDate, task.daysToFinish);

        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: task.task,
          description: task.description,
          dueDate: format(dueDate, "yyyy-MM-dd"),
          priority: 1,
          status: "todo",
        };
      });

      setTasks(generatedTasks);
      setIsAutomateModalOpen(false);
      setAutomateForm({
        projectName: "",
        projectDescription: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate tasks. Please try again.");
    }
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
            {tasks
              .filter((task) => task.status === status)
              .map((task, index) => (
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
        <h1>{projectName}</h1>
        <div style={{display:"flex", gap:"10px"}}>
          <button
            onClick={() => setIsAutomateModalOpen(true)}
            className="automate-button"
          >
            <Wand2 size={16} /> Automate
          </button>

          <button onClick={handleGoToBoard} className="board-button">
            <ArrowRight size={16} /> Taskboard
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
        <div className="sort-controls">
          <div className="custom-dropdown" ref={dropdownRef}>
            <button
              className="sort-dropdown-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort Tasks
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => handleSort("priority")}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Sort by Priority
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleSort("dueDate")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Sort by Due Date
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sections-container">
          <TaskSection title="To Do" status="todo" tasks={tasks} />
          <TaskSection title="In Progress" status="in-progress" tasks={tasks} />
          <TaskSection title="Completed" status="completed" tasks={tasks} />
        </div>

        {/* Edit Task Modal */}
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

        {/* View Task Modal */}
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

        {/* Automate Modal */}
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
