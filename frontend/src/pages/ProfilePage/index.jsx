import React from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import "./profilepage.css";

const ProfilePage = ({ isAuthenticated, logout, user }) => {
  // Access user from props
  const navigate = useNavigate();

  // Function to navigate to the reset password page
  const handleChangePasswordClick = () => {
    navigate("/reset-password");
  };

  // Function to handle logout action
  const handleLogoutClick = () => {
    logout(); // Call the logout action to update Redux state
    navigate("/login"); // Redirect to login page after logout
  };

  const projects = [
    {
      name: "Interactive Quiz Platform",
      progress: 70,
      description:
        "A platform that allows users to take interactive quizzes and track performance.",
    },
    {
      name: "Task Management System",
      progress: 40,
      description:
        "A robust task management tool for collaborative projects with real-time updates.",
    },
    {
      name: "Trading Opportunities Analyzer",
      progress: 85,
      description:
        "A system to identify trading opportunities using advanced algorithms.",
    },
  ];

  const badges = [
    { title: "Top Performer", image: "badge1.png" },
    { title: "Procrastinator", image: "badge2.png" },
    { title: "Hackathon Winner", image: "badge3.png" },
  ];

  if (!user) {
    return <div className="loading-container">Loading your profile...</div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-banner">
          <div className="profile-avatar-container">
            <img
              src="https://via.placeholder.com/150"
              alt="User Avatar"
              className="profile-avatar"
            />
          </div>
          {/* Dynamically render user name */}
          <h1 className="profile-name">{`${user?.first_name} ${user?.last_name}`}</h1>
          <div className="action-buttons">
            <button className="profile-button">Update Details</button>
            <button
              className="profile-button"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </button>
            <button className="profile-button" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="profile-section">
        <h2 className="section-title">Badges</h2>
        <div className="profile-section-container">
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <div className="badge-card" key={index}>
                <img src="/award-img.png" className="badge-image" />
                <p className="badge-title">{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Projects</h2>
        <div className="profile-section-container">
          <div className="projects-list">
            {projects.map((project, index) => (
              <div className="project-bar" key={index}>
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${project.progress}%` }}
                  >
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// mapStateToProps to retrieve authentication status and user data from Redux state
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user, // Assuming the user data is stored in auth.user
});

export default connect(mapStateToProps, { logout })(ProfilePage);
