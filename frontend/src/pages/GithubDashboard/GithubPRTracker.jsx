import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GithubDashboard.css';

const GithubPRTracker = ({ userName, repo }) => {
  const [githubPullRequests, setGithubPullRequests] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');

  useEffect(() => {
    const fetchGithubPullRequests = async () => {
      setGithubLoading(true);
      setGithubError('');
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${userName}/${repo}/pulls`
        );
        setGithubPullRequests(response.data);
      } catch (err) {
        setGithubError('Failed to fetch pull requests');
      } finally {
        setGithubLoading(false);
      }
    };

    if (userName && repo) {
      fetchGithubPullRequests();
    }
  }, [userName, repo]);

  return (
    <div className="github-pr-container">
      {githubLoading && <p className="github-loading-text">Loading pull requests...</p>}
      {githubError && <p className="github-error-text">{githubError}</p>}
      {!githubLoading && githubPullRequests.length > 0 ? (
        <div className="github-pr-list">
          {githubPullRequests.map((pr) => (
            <div key={pr.id} className="github-pr-box">
              <h4 className="github-pr-title">{pr.title}</h4>
              <p className="github-pr-description">{pr.user.login} opened a pull request.</p>
              <span className="github-pr-time">
                {new Date(pr.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No pull requests found.</p>
      )}
    </div>
  );
};

export default GithubPRTracker;
