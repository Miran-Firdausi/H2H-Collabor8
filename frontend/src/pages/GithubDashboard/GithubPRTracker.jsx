import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GithubDashboard.css';

const GithubPRTracker = ({ userName, repo }) => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPullRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${userName}/${repo}/pulls`
        );
        setPullRequests(response.data);
      } catch (err) {
        setError('Failed to fetch pull requests');
      } finally {
        setLoading(false);
      }
    };

    if (userName && repo) {
      fetchPullRequests();
    }
  }, [userName, repo]);

  return (
    <div className="pr-container">
      {loading && <p className="loading-text">Loading pull requests...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && pullRequests.length > 0 ? (
        <div className="pr-list">
          {pullRequests.map((pr) => (
            <div key={pr.id} className="pr-box">
              <h4 className="pr-title">{pr.title}</h4>
              <p className="pr-description">{pr.user.login} opened a pull request.</p>
              <span className="pr-time">
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
