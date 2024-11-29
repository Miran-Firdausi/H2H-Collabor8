import React, { useState, useEffect } from "react";
import GithubActivityTracker from "./GithubActivityTracker";
import GithubPRTracker from "./GithubPRTracker";
import GithubIssueTracker from "./GithubIssueTracker";
import axios from "axios";
import "./GithubDashboard.css";

const GithubDashboard = () => {
  const [githubUserName, setGithubUserName] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [githubActiveTab, setGithubActiveTab] = useState("activity");
  const [activities, setActivities] = useState([]);
  const [issues, setIssues] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    
    const savedUsername = localStorage.getItem('githubUsername');
    const savedRepo = localStorage.getItem('githubRepo');
    
    if (savedUsername && savedRepo) {
      setGithubUserName(savedUsername);
      setGithubRepo(savedRepo);
      setShowForm(false);
      fetchGithubData(savedUsername, savedRepo);
    }
  }, []);

  const fetchGithubData = async (username, repo) => {
    try {
      const pr_response = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/pulls`
      );
      const issues_response = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/issues`
      );
      const activities_response = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/events`
      );
      setActivities(activities_response.data);
      setPullRequests(pr_response.data);
      setIssues(issues_response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch from GitHub");
      console.log(err);
    }
  };

  const handleGithubSubmit = async (e) => {
    e.preventDefault();

    // Save to localStorage
    localStorage.setItem('githubUsername', githubUserName);
    localStorage.setItem('githubRepo', githubRepo);
    
    await fetchGithubData(githubUserName, githubRepo);
    setShowForm(false);
  };

  const renderGithubTabContent = () => {
    switch (githubActiveTab) {
      case "activity":
        return <GithubActivityTracker activities={activities} />;
      case "pr":
        return <GithubPRTracker pullRequests={pullRequests} />;
      case "issues":
        return <GithubIssueTracker issues={issues} />;
      default:
        return <GithubActivityTracker activities={activities} />;
    }
  };

  return (
    <div className="github-container">
      <h2 className="github-header">GitHub Dashboard</h2>
      
      {showForm ? (
        <form className="github-form" onSubmit={handleGithubSubmit}>
          <div>
            <div className="form-group">
              <label htmlFor="github-username">GitHub Username:</label>
              <input
                id="github-username"
                type="text"
                placeholder="Enter GitHub username"
                value={githubUserName}
                onChange={(e) => setGithubUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="github-repo">Repository Name:</label>
              <input
                id="github-repo"
                type="text"
                placeholder="Enter repository name"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="github-button">
            Show Activity
          </button>
        </form>
      ) : (
        <>
          <div className="github-repo-info">
            {githubUserName}/{githubRepo}
            <button 
              className="github-edit-button"
              onClick={() => setShowForm(true)}
            >
              Edit
            </button>
          </div>

          <div className="github-button-container github-show-buttons">
            <button
              onClick={() => setGithubActiveTab("activity")}
              className="github-tab-button"
            >
              Activity
            </button>
            <button
              onClick={() => setGithubActiveTab("pr")}
              className="github-tab-button"
            >
              Pull Requests
            </button>
            <button
              onClick={() => setGithubActiveTab("issues")}
              className="github-tab-button"
            >
              Issues
            </button>
          </div>
        </>
      )}

      {error && <p className="github-error-text">{error}</p>}
      
      {!showForm && renderGithubTabContent()}
    </div>
  );
};

export default GithubDashboard;