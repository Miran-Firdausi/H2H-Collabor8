import "./GithubDashboard.css";

const GithubActivityTracker = ({ activities }) => {
  const getGithubActivityDescription = (activity) => {
    switch (activity.type) {
      case "PushEvent":
        return activity.payload.commits.length
          ? activity.payload.commits[0].message
          : "No commit message available";
      case "CreateEvent":
        return `Created a new ${activity.payload.ref_type} ${activity.payload.ref}`;
      case "DeleteEvent":
        return `Deleted a ${activity.payload.ref_type} ${activity.payload.ref}`;
      case "MemberEvent":
        return `${activity.actor.login} added a new member to the repository`;
      case "PublicEvent":
        return `${activity.actor.login} made the repository public`;
      default:
        return "No description available for this event type";
    }
  };

  return (
    <div className="github-activity-container">
      {activities.length > 0 ? (
        <div className="github-activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="github-activity-box">
              <h4 className="github-activity-title">
                {activity.actor.login} - {activity.type}
              </h4>
              <p className="github-activity-description">
                {getGithubActivityDescription(activity)}
              </p>
              <span className="github-activity-time">
                {new Date(activity.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No activity found.</p>
      )}
    </div>
  );
};

export default GithubActivityTracker;
