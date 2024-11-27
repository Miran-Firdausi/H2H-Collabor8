import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GithubDashboard.css';

const GithubIssueTracker = ({ userName, repo }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${userName}/${repo}/issues`
        );
        setIssues(response.data);
      } catch (err) {
        setError('Failed to fetch issues');
      } finally {
        setLoading(false);
      }
    };

    if (userName && repo) {
      fetchIssues();
    }
  }, [userName, repo]);

  return (
    <div className="issue-container">
      {loading && <p className="loading-text">Loading issues...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && issues.length > 0 ? (
        <div className="issue-list">
          {issues.map((issue) => (
            <div key={issue.id} className="issue-box">
              <h4 className="issue-title">{issue.title}</h4>
              <p className="issue-description">{issue.user.login} opened an issue.</p>
              <span className="issue-time">
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
