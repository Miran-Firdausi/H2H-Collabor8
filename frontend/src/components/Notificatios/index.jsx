import React, { useState, useEffect } from "react";
import { Check, CheckCheck, Loader, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getConfig } from "../../utils/httpConfig";
import "./Notifications.css";
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const config = getConfig();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/notifications/",
        config
      );
      setNotifications(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load notifications");
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const pollInterval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/notifications/${notificationId}/read/`,
        {},
        config
      );
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/notifications/mark-all-read/",
        {},
        config
      );
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/notifications/${notificationId}/`,
        config
      );
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "project_created":
        return "🎉";
      case "project_updated":
        return "📝";
      case "project_deleted":
        return "🗑️";
      case "project_shared":
        return "🤝";
      case "discussion_created":
        return "💬";
      default:
        return "📢";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="notif-container">
      <div className="notif-content-wrapper">
        <div className="notif-header">
          <h1 className="notif-title">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="notif-mark-all-btn">
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="notif-loading">
            <Loader className="animate-spin" size={24} />
          </div>
        ) : error ? (
          <div className="notif-error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">No notifications yet</div>
        ) : (
          <div className="notif-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notif-item ${
                  !notification.is_read
                    ? "notif-item-unread"
                    : "notif-item-read"
                }`}
              >
                <div className="notif-item-content">
                  <span className="notif-icon">
                    {getNotificationIcon(notification.notification_type)}
                  </span>
                  <div className="notif-details">
                    <h4 className="notif-item-title">{notification.title}</h4>
                    <p className="notif-item-message">{notification.message}</p>
                    <div className="notif-item-footer">
                      <span className="notif-timestamp">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                      <div className="notif-actions">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="btn-secondary"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="btn-danger"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
