import "./GithubDashboard.css";

const GithubIssueTracker = ({ issues }) => {
  return (
    <div className="github-activity-container">
      {issues.length > 0 ? (
        <div className="github-activity-list">
          {issues.map((issue) => (
            <div key={issue.id} className="github-activity-box">
              <h4 className="github-activity-title">{issue.title}</h4>
              <p className="github-activity-description">
                {issue.user.login} opened an issue.
              </p>
              <span className="github-activity-time">
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
