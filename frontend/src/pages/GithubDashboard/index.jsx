import React, { useState } from "react";
import { GitBranch, GitPullRequest, MessageSquare, Plus } from "lucide-react";
import "./GitHubDashboard.css";

const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
);

const Input = ({ ...props }) => <input {...props} className="input" />;

const Alert = ({ children }) => <div className="alert">{children}</div>;

const GitHubDashboard = () => {
  const [token, setToken] = useState("");
  const [repoName, setRepoName] = useState("");
  const [owner, setOwner] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [prBody, setPrBody] = useState("");
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState([]);
  const [issues, setIssues] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("repos");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const fetchRepos = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${owner}/repos`,
        { headers }
      );
      const data = await response.json();
      setRepos(data);
      setMessage("Repositories fetched successfully");
    } catch (error) {
      setMessage("Error fetching repositories: " + error.message);
    }
  };

  const createRepo = async () => {
    try {
      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: repoName,
          private: false,
          auto_init: true,
        }),
      });
      const data = await response.json();
      setMessage(`Repository ${data.name} created successfully`);
      fetchRepos();
    } catch (error) {
      setMessage("Error creating repository: " + error.message);
    }
  };

  const createIssue = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/issues`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: issueTitle,
            body: issueBody,
          }),
        }
      );
      const data = await response.json();
      setMessage(`Issue created successfully: #${data.number}`);
      fetchIssues();
    } catch (error) {
      setMessage("Error creating issue: " + error.message);
    }
  };

  const createPullRequest = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/pulls`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: prTitle,
            body: prBody,
            head: "feature-branch",
            base: "main",
          }),
        }
      );
      const data = await response.json();
      setMessage(`Pull request created successfully: #${data.number}`);
      fetchPullRequests();
    } catch (error) {
      setMessage("Error creating pull request: " + error.message);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/issues`,
        { headers }
      );
      const data = await response.json();
      setIssues(data);
      setMessage("Issues fetched successfully");
    } catch (error) {
      setMessage("Error fetching issues: " + error.message);
    }
  };

  const fetchPullRequests = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/pulls`,
        { headers }
      );
      const data = await response.json();
      setPullRequests(data);
      setMessage("Pull requests fetched successfully");
    } catch (error) {
      setMessage("Error fetching pull requests: " + error.message);
    }
  };

  return (
    <div className="github-dashboard">
      <Card className="header-card">
        <h2 className="dashboard-title">GitHub Repository Dashboard</h2>
        <div className="input-group">
          <Input
            placeholder="GitHub Personal Access Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Input
            placeholder="Repository Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <Input
            placeholder="Repository Name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
        </div>
      </Card>

      {message && <Alert>{message}</Alert>}

      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab("repos")}
          className={`tab-button ${activeTab === "repos" ? "active" : ""}`}
        >
          <GitBranch className="icon" />
          Repositories
        </button>
        <button
          onClick={() => setActiveTab("issues")}
          className={`tab-button ${activeTab === "issues" ? "active" : ""}`}
        >
          <MessageSquare className="icon" />
          Issues
        </button>
        <button
          onClick={() => setActiveTab("prs")}
          className={`tab-button ${activeTab === "prs" ? "active" : ""}`}
        >
          <GitPullRequest className="icon" />
          Pull Requests
        </button>
      </div>

      {activeTab === "repos" && (
        <Card>
          <div className="section-header">
            <h3 className="section-title">Repositories</h3>
            <Button onClick={fetchRepos}>Fetch Repos</Button>
          </div>
          <div className="section-content">
            <div className="button-container">
              <Button onClick={createRepo}>
                <Plus className="icon" />
                Create Repository
              </Button>
            </div>
            <div className="card-list">
              {repos.map((repo) => (
                <Card key={repo.id} className="item-card">
                  <h3 className="item-title">{repo.name}</h3>
                  <p className="item-description">{repo.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === "issues" && (
        <Card>
          <div className="section-header">
            <h3 className="section-title">Issues</h3>
            <Button onClick={fetchIssues}>Fetch Issues</Button>
          </div>
          <div className="section-content">
            <div className="form-group">
              <Input
                placeholder="Issue Title"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
              <Input
                placeholder="Issue Body"
                value={issueBody}
                onChange={(e) => setIssueBody(e.target.value)}
              />
              <Button onClick={createIssue}>Create Issue</Button>
            </div>
            <div className="card-list">
              {issues.map((issue) => (
                <Card key={issue.id} className="item-card">
                  <h3 className="item-title">
                    #{issue.number} {issue.title}
                  </h3>
                  <p className="item-description">{issue.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === "prs" && (
        <Card>
          <div className="section-header">
            <h3 className="section-title">Pull Requests</h3>
            <Button onClick={fetchPullRequests}>Fetch PRs</Button>
          </div>
          <div className="section-content">
            <div className="form-group">
              <Input
                placeholder="PR Title"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
              />
              <Input
                placeholder="PR Body"
                value={prBody}
                onChange={(e) => setPrBody(e.target.value)}
              />
              <Button onClick={createPullRequest}>Create PR</Button>
            </div>
            <div className="card-list">
              {pullRequests.map((pr) => (
                <Card key={pr.id} className="item-card">
                  <h3 className="item-title">
                    #{pr.number} {pr.title}
                  </h3>
                  <p className="item-description">{pr.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GitHubDashboard;
