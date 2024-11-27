import React, { useState } from "react";
import GithubActivityTracker from "./GithubActivityTracker";
import GithubPRTracker from "./GithubPRTracker";
import GithubIssueTracker from "./GithubIssueTracker";
import "./GithubDashboard.css";

const GithubDashboard = () => {
  const [userName, setUserName] = useState("");
  const [repo, setRepo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activity":
        return <GithubActivityTracker userName={userName} repo={repo} />;
      case "pr":
        return <GithubPRTracker userName={userName} repo={repo} />;
      case "issues":
        return <GithubIssueTracker userName={userName} repo={repo} />;
      default:
        return <GithubActivityTracker userName={userName} repo={repo} />;
    }
  };

  return (
    <div className="github-container">
      <h2 className="github-header">GitHub Dashboard</h2>
      <form className="github-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">GitHub Username:</label>
          <input
            id="username"
            type="text"
            placeholder="Enter GitHub username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="repo">Repository Name:</label>
          <input
            id="repo"
            type="text"
            placeholder="Enter repository name"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">
          Show Activity
        </button>
      </form>

      {isSubmitted && userName && repo && (
        <div className="button-container show-buttons">
          <button
            onClick={() => setActiveTab("activity")}
            className="tab-button"
          >
            Activity
          </button>
          <button onClick={() => setActiveTab("pr")} className="tab-button">
            Pull Requests
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className="tab-button"
          >
            Issues
          </button>
        </div>
      )}

      {isSubmitted && userName && repo && (
        <div className="content-container">{renderTabContent()}</div>
      )}
    </div>
  );
};

export default GithubDashboard;
