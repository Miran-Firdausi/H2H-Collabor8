import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GithubDashboard.css';

const GithubActivityTracker = ({ userName, repo }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${userName}/${repo}/events`
        );
        setActivities(response.data);
      } catch (err) {
        setError('Failed to fetch GitHub activities');
      } finally {
        setLoading(false);
      }
    };

    if (userName && repo) {
      fetchActivities();
    }
  }, [userName, repo]);

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'PushEvent':
        return activity.payload.commits.length
          ? activity.payload.commits[0].message
          : 'No commit message available';
      case 'CreateEvent':
        return `Created a new ${activity.payload.ref_type} ${activity.payload.ref}`;
      case 'DeleteEvent':
        return `Deleted a ${activity.payload.ref_type} ${activity.payload.ref}`;
      case 'MemberEvent':
        return `${activity.actor.login} added a new member to the repository`;
      case 'PublicEvent':
        return `${activity.actor.login} made the repository public`;
      default:
        return 'No description available for this event type';
    }
  };

  return (
    <div className="activity-container">
      {loading && <p className="loading-text">Loading activities...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && activities.length > 0 ? (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-box">
              <h4 className="activity-title">{activity.actor.login} - {activity.type}</h4>
              <p className="activity-description">{getActivityDescription(activity)}</p>
              <span className="activity-time">
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
