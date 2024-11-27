import React, { useState } from "react";
import axios from "axios";
import { addDays } from "date-fns";
import { format } from "date-fns";
import { useKanbanContext } from "../../contexts/KanbanContext";
import "./AutomationModal.css";

function AutomationModal() {
  const [automateForm, setAutomateForm] = useState({
    projectName: "",
    projectDescription: "",
  });

  const { setIsAutomateModalOpen, setProjectName, setTasks } =
    useKanbanContext();

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
          dependencies: [],
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
  return (
    <div className="automation-modal-overlay">
      <div className="automation-modal">
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
          className="automation-text-input"
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
          className="automation-text-input automation-description-input"
        />
        <div className="automation-modal-buttons">
          <button onClick={handleAutomate} className="btn-primary">
            Generate Tasks
          </button>
          <button
            onClick={() => setIsAutomateModalOpen(false)}
            className="automation-cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AutomationModal;
