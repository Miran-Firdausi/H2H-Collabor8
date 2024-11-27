import React, { useState } from 'react';
import './GithubDashboard.css';

const GithubForm = ({ onSubmit }) => {
  const [userName, setUserName] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName && repo) {
      onSubmit(userName, repo);
    }
  };

  return (
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
        Submit
      </button>
    </form>
  );
};

export default GithubForm;
