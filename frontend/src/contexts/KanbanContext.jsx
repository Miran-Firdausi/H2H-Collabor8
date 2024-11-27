import React, { createContext, useContext, useState } from "react";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    id: "",
    name: "",
    description: "",
    dueDate: "",
    priority: 1,
    status: "todo",
    dependencies: [],
  });
  const [isAddingTask, setIsAddingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutomateModalOpen, setIsAutomateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("To-Do");

  // Function to check if a task can be moved to a new status
  const canChangeStatus = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (task.dependencies.length > 0) {
      // All dependencies must be completed
      if (newStatus === "completed") {
        return task.dependencies.every(
          (depId) => tasks.find((t) => t.id === depId)?.status === "completed"
        );
      }
      // All dependencies must be at least in progress
      else if (newStatus === "in-progress") {
        return task.dependencies.every((depId) => {
          const depTask = tasks.find((t) => t.id === depId);
          return (
            depTask?.status === "completed" || depTask?.status === "in-progress"
          );
        });
      }
    }
    return true;
  };

  // Function to get available tasks for dependencies
  const getAvailableTasksForDependency = (taskId) => {
    return tasks.filter((task) => {
      if (task.id === taskId) return false;
      const wouldCreateCircular = (dependencyId, checkedIds = new Set()) => {
        if (checkedIds.has(dependencyId)) return true;
        checkedIds.add(dependencyId);
        const task = tasks.find((t) => t.id === dependencyId);
        return task?.dependencies.some(
          (depId) =>
            depId === taskId || wouldCreateCircular(depId, new Set(checkedIds))
        );
      };
      return !wouldCreateCircular(task.id);
    });
  };

  // Add a new task
  const addTask = () => {
    if (newTask.name && newTask.dueDate) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { ...newTask, id: Date.now().toString(), status: "todo" },
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
      setIsModalOpen(false);
    }
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks
        .map((task) => ({
          ...task,
          dependencies: task.dependencies.filter((depId) => depId !== taskId),
        }))
        .filter((task) => task.id !== taskId)
    );
  };

  // Update a task
  const updateTask = (taskId, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
    setEditingTask(null);
    setIsModalOpen(false);
  };

  function onClose() {
    setIsModalOpen(false);
    setEditingTask(false);
    setViewingTask(false);
    setIsAddingTask(false);
  }

  return (
    <KanbanContext.Provider
      value={{
        tasks,
        setTasks,
        newTask,
        setNewTask,
        editingTask,
        setEditingTask,
        isModalOpen,
        setIsModalOpen,
        isAutomateModalOpen,
        setIsAutomateModalOpen,
        isViewModalOpen,
        setIsViewModalOpen,
        isAddingTask,
        setIsAddingTask,
        viewingTask,
        setViewingTask,
        projectName,
        setProjectName,
        canChangeStatus,
        getAvailableTasksForDependency,
        addTask,
        deleteTask,
        updateTask,
        onClose,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

// Custom hook for consuming the context
export const useKanbanContext = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanbanContext must be used within a KanbanProvider");
  }
  return context;
};
