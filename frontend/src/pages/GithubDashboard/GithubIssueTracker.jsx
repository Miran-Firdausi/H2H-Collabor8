import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GithubDashboard.css';

const GithubIssueTracker = ({ userName, repo }) => {
  const [githubIssues, setGithubIssues] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');

  useEffect(() => {
    const fetchGithubIssues = async () => {
      setGithubLoading(true);
      setGithubError('');
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${userName}/${repo}/issues`
        );
        setGithubIssues(response.data);
      } catch (err) {
        setGithubError('Failed to fetch issues');
      } finally {
        setGithubLoading(false);
      }
    };

    if (userName && repo) {
      fetchGithubIssues();
    }
  }, [userName, repo]);

  return (
    <div className="github-issue-container">
      {githubLoading && <p className="github-loading-text">Loading issues...</p>}
      {githubError && <p className="github-error-text">{githubError}</p>}
      {!githubLoading && githubIssues.length > 0 ? (
        <div className="github-issue-list">
          {githubIssues.map((issue) => (
            <div key={issue.id} className="github-issue-box">
              <h4 className="github-issue-title">{issue.title}</h4>
              <p className="github-issue-description">{issue.user.login} opened an issue.</p>
              <span className="github-issue-time">
                {new Date(issue.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No issues found.</p>
      )}
    </div>
  );
};

export default GithubIssueTracker;
