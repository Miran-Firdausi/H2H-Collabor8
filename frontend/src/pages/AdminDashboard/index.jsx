import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  BarChart3,
  Clock,
  CheckSquare,
  AlertTriangle,
  Plus,
  Trash2,
  NotepadText,
  BookOpenText,
  Link2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import "./AdminDashboard.css"

const AdminDashboard = () => {
  // Moved all data to centralized objects/arrays for easier backend integration later
  const [projectDetails] = useState({
    name: "Clip Kadabra",
    description: "A powerful video editing tool",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    progress: 65,
  });

  const [analyticsData] = useState({
    totalTasks: { value: 25, change: "+2 from last week" },
    completionRate: { value: 78, change: "+5% from last month" },
    pendingTasks: { value: 8, change: "Need attention" },
    unassignedTasks: { value: 3, change: "Requires assignment" },
  });

  const [taskStatusData] = useState([
    { name: "To Do", value: 8, color: "#e11d48" },
    { name: "In Progress", value: 5, color: "#f59e0b" },
    { name: "Completed", value: 12, color: "#68b984" },
  ]);

  const [pendingTasks] = useState([
    {
      id: 1,
      name: "Update user interface",
      dependencies: 2,
      assignee: "Sarah Chen",
      priority: "High",
    },
    {
      id: 2,
      name: "Fix authentication bug",
      dependencies: 1,
      assignee: "Mike Ross",
      priority: "Medium",
    },
    {
      id: 3,
      name: "Implement search feature",
      dependencies: 3,
      assignee: "Sarah Chen",
      priority: "High",
    },
    {
      id: 4,
      name: "Write API documentation",
      dependencies: 0,
      assignee: "Alex Kim",
      priority: "Low",
    },
  ]);

  const [teamProgress] = useState([
    {
      team: "Development",
      tasks: {
        todo: 5,
        inProgress: 3,
        completed: 8,
        total: 16,
      },
    },
    {
      team: "Design",
      tasks: {
        todo: 2,
        inProgress: 1,
        completed: 4,
        total: 7,
      },
    },
    {
      team: "QA",
      tasks: {
        todo: 1,
        inProgress: 1,
        completed: 0,
        total: 2,
      },
    },
  ]);

  const [upcomingEvents] = useState([
    { title: "Team Sync", date: "Today, 2:00 PM" },
    { title: "Sprint Review", date: "Tomorrow, 10:00 AM" },
    { title: "Design Review", date: "Apr 5, 3:00 PM" },
  ]);

  const [teamMembers, setTeamMembers] = useState([
    {
      name: "Alex Kim",
      role: "Project Manager",
      status: "online",
      tasks: 12,
      team: "Management",
    },
    {
      name: "Sarah Chen",
      role: "Developer",
      status: "busy",
      tasks: 8,
      team: "Development",
    },
    {
      name: "Mike Ross",
      role: "Designer",
      status: "away",
      tasks: 5,
      team: "Design",
    },
  ]);

  const availableRoles = [
    "Project Manager",
    "Developer",
    "Designer",
    "QA Engineer",
    "Product Owner",
    "Scrum Master",
  ];

  const [isManaging, setIsManaging] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState(availableRoles[0]);

  const handleRoleChange = (index, newRole) => {
    const updatedMembers = teamMembers.map((member, i) => ({
      ...member,
      role: i === index ? newRole : member.role,
    }));
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (newMemberName.trim()) {
      setTeamMembers([
        ...teamMembers,
        {
          name: newMemberName,
          role: newMemberRole,
          status: "online",
          tasks: 0,
          team: newMemberRole,
        },
      ]);
      setNewMemberName("");
      setNewMemberRole(availableRoles[0]);
    }
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  // Helper function to calculate progress bar widths
  const calculateWidth = (value, total) => {
    return `${(value / total) * 100}%`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin</p>
      </div>

      <div className="quick-actions">
        <Link to="/todo" className="action-card">
          <CheckSquare size={24} />
          <span>Kanban</span>
        </Link>
        <Link to="/calendar" className="action-card">
          <Calendar size={24} />
          <span>Calendar</span>
        </Link>
        <Link to="/board" className="action-card">
          <NotepadText size={24} />
          <span>Task Board</span>
        </Link>
        <Link to="/CollabDoc" className="action-card">
          <BookOpenText size={24} />
          <span>CollabDoc</span>
        </Link>
      </div>

      <div className="overview-events-team-grid">
        <div className="card project-overview">
          <h2>Project Overview</h2>
          <div className="project-details">
            <h3>{projectDetails.name}</h3>
            <p>{projectDetails.description}</p>
            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span>{projectDetails.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${projectDetails.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="date-section">
              <div>
                <p className="label">Start Date</p>
                <p className="value">{projectDetails.startDate}</p>
              </div>
              <div>
                <p className="label">End Date</p>
                <p className="value">{projectDetails.endDate}</p>
              </div>
            </div>

            <div className="analytics-section">
              <h3>Analytics Overview</h3>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>Total Tasks</h3>
                    <CheckSquare size={16} />
                  </div>
                  <div className="analytics-content">
                    <div className="metric">
                      {analyticsData.totalTasks.value}
                    </div>
                    <p className="metric-subtext">
                      {analyticsData.totalTasks.change}
                    </p>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>Completion Rate</h3>
                    <BarChart3 size={16} />
                  </div>
                  <div className="analytics-content">
                    <div className="metric">
                      {analyticsData.completionRate.value}%
                    </div>
                    <p className="metric-subtext">
                      {analyticsData.completionRate.change}
                    </p>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>Pending Tasks</h3>
                    <AlertTriangle size={16} />
                  </div>
                  <div className="analytics-content">
                    <div className="metric">
                      {analyticsData.pendingTasks.value}
                    </div>
                    <p className="metric-subtext">
                      {analyticsData.pendingTasks.change}
                    </p>
                  </div>
                </div>

                <div className="analytics-card">
                  <div className="analytics-header">
                    <h3>Unassigned Tasks</h3>
                    <AlertTriangle size={16} />
                  </div>
                  <div className="analytics-content">
                    <div className="metric">
                      {analyticsData.unassignedTasks.value}
                    </div>
                    <p className="metric-subtext">
                      {analyticsData.unassignedTasks.change}
                    </p>
                  </div>
                </div>
              </div>

              <div className="task-distribution-section">
                <h3>Task Distribution</h3>
                <div className="distribution-content">
                  <div className="pie-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="pending-tasks-list">
                    <h4>Pending Tasks</h4>
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="pending-task-item">
                        <div className="task-header">
                          <span className="task-name">{task.name}</span>
                          <span
                            className="task-priority"
                            data-priority={task.priority.toLowerCase()}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="task-details">
                          <span className="task-assignee">{task.assignee}</span>
                          <span className="task-dependencies">
                            <Link2 size={14} />
                            {task.dependencies} dependencies
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="events-team-container">
          <div className="card events-card">
            <h2>Upcoming Events</h2>
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <Clock size={16} />
                  <div>
                    <p className="event-title">{event.title}</p>
                    <p className="event-date">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card team-section">
            <div className="team-header">
              <div className="team-header-content">
                <h2>Team Members</h2>
                <span className="team-count">Total: {teamMembers.length}</span>
              </div>
              <button
                className="manage-button"
                onClick={() => setIsManaging(!isManaging)}
              >
                {isManaging ? "Done" : "Manage"}
              </button>
            </div>

            {isManaging && (
              <div className="add-member-form">
                <input
                  type="text"
                  placeholder="New member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="member-input"
                />
                <div className="role-and-button">
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="role-select"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button className="add-button" onClick={addTeamMember}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="team-list">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member-avatar">
                    <Users size={20} />
                  </div>
                  <div className="member-info">
                    <p className="member-name">{member.name}</p>
                    {isManaging ? (
                      <div className="role-edit">
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(index, e.target.value)
                          }
                          className="role-select"
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <button
                          className="remove-button"
                          onClick={() => removeTeamMember(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <p className="member-role">{member.role}</p>
                    )}
                  </div>
                  <div className={`status-indicator ${member.status}`}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card team-progress-section">
            <h2>Team Progress</h2>
            <div className="team-progress-list">
              {teamProgress.map((team, index) => (
                <div key={index} className="team-progress-item">
                  <div className="team-progress-header">
                    <h4>{team.team}</h4>
                    <span className="task-count">{team.tasks.total} tasks</span>
                  </div>
                  <div className="team-progress-bar">
                    <div
                      className="progress-segment todo"
                      style={{
                        width: calculateWidth(
                          team.tasks.todo,
                          team.tasks.total
                        ),
                      }}
                    >
                      {team.tasks.todo}
                    </div>
                    <div
                      className="progress-segment in-progress"
                      style={{
                        width: calculateWidth(
                          team.tasks.inProgress,
                          team.tasks.total
                        ),
                      }}
                    >
                      {team.tasks.inProgress}
                    </div>
                    <div
                      className="progress-segment completed"
                      style={{
                        width: calculateWidth(
                          team.tasks.completed,
                          team.tasks.total
                        ),
                      }}
                    >
                      {team.tasks.completed}
                    </div>
                  </div>
                  <div className="progress-legend">
                    <span className="legend-item">
                      <span className="legend-dot todo"></span>
                      To Do
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot in-progress"></span>
                      In Progress
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot completed"></span>
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
