/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Wand2, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import TaskSection from "../../components/TaskSection";
import AddOrEditTaskForm from "../../components/AddOrEditTaskForm";
import AutomationModal from "../../components/AutomationModal";
import ViewTaskModal from "../../components/ViewTaskModal";
import KanbanSortControls from "../../components/KanbanSortControls";
import { useKanbanContext } from "../../contexts/KanbanContext";

import "./ToDo.css";

const ToDo = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectNameDefault = params.get("name");

  const {
    tasks,
    setTasks,
    editingTask,
    viewingTask,
    canChangeStatus,
    isModalOpen,
    setIsModalOpen,
    isAutomateModalOpen,
    setIsAutomateModalOpen,
    projectName,
    setProjectName,
    isAddingTask,
    onClose,
    setIsAddingTask,
  } = useKanbanContext();

  useEffect(() => {
    if (projectNameDefault) {
      setProjectName(projectNameDefault);
    } else {
      setProjectName("To-do");
    }
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const allTasks = [...tasks];
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceItems = allTasks.filter((task) => task.status === sourceStatus);
    const taskToMove = sourceItems[source.index];

    if (!canChangeStatus(taskToMove.id, destStatus)) {
      alert(
        "Cannot change task status: dependent tasks must be completed first"
      );
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

  function handleNewTaskBtnClick() {
    setIsModalOpen(true);
    setIsAddingTask(true);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="todo-kanban">
        <h1 className="todo-title">Projects / {projectName}</h1>
        <header className="todo-header">
          <div className="todo-buttons">
            <button
              onClick={handleNewTaskBtnClick}
              className="todo-new-task-button"
            >
              <Plus size={16} /> New Task
            </button>
            <button
              onClick={() => setIsAutomateModalOpen(true)}
              className="todo-automate-button"
            >
              <Wand2 size={16} /> Automate
            </button>
          </div>
          <div className="search-bar">
            <input type="search" placeholder="Search" />
          </div>
          <KanbanSortControls />
        </header>

        <div className="todo-sections">
          <TaskSection title="To Do" status="todo" tasks={tasks} />
          <TaskSection title="In Progress" status="in-progress" tasks={tasks} />
          <TaskSection title="Completed" status="completed" tasks={tasks} />
        </div>

        {isModalOpen && (
          <>
            <div className="task-backdrop" onClick={onClose}></div>
            {(isAddingTask || editingTask) && <AddOrEditTaskForm />}
            {viewingTask && <ViewTaskModal />}
          </>
        )}
        {isAutomateModalOpen && <AutomationModal />}
      </div>
    </DragDropContext>
  );
};

export default ToDo;
