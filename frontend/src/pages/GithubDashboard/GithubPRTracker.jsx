import "./GithubDashboard.css";

const GithubPRTracker = ({ pullRequests }) => {
  return (
    <div className="github-activity-container">
      {pullRequests.length > 0 ? (
        <div className="github-activity-list">
          {pullRequests.map((pr) => (
            <div key={pr.id} className="github-activity-box">
              <h4 className="github-activity-title">{pr.title}</h4>
              <p className="github-activity-description">
                {pr.user.login} opened a pull request.
              </p>
              <span className="github-activity-time">
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
