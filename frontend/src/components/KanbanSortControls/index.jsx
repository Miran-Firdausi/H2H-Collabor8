import React, { useState, useEffect, useRef } from "react";
import { ArrowUpDown, Star, Calendar } from "lucide-react";
import "./KanbanSortControls.css";

function KanbanSortControls() {
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <div className="sort-controls">
      <div className="custom-dropdown" ref={dropdownRef}>
        <button
          className="sort-dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <ArrowUpDown size={16} className="mr-2 h-4 w-4" />
          Sort Tasks
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleSort("priority")}
            >
              <Star size={16} className="mr-2 h-4 w-4" />
              Sort by Priority
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSort("dueDate")}
            >
              <Calendar size={16} className="mr-2 h-4 w-4" />
              Sort by Due Date
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanSortControls;
