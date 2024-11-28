import React, { useState } from 'react';
import './GithubDashboard.css';

const GithubForm = ({ onSubmit }) => {
  const [githubUserName, setGithubUserName] = useState('');
  const [githubRepo, setGithubRepo] = useState('');

  const handleGithubSubmit = (e) => {
    e.preventDefault();
    if (githubUserName && githubRepo) {
      onSubmit(githubUserName, githubRepo);
    }
  };

  return (
    <form className="github-form" onSubmit={handleGithubSubmit}>
      <div className="github-form-group">
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
      <div className="github-form-group">
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
      <button type="submit" className="github-button">
        Submit
      </button>
    </form>
  );
};

export default GithubForm;
