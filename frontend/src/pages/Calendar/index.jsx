import React, { useState, useEffect } from "react";
import CalendarView from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { TwitterPicker } from "react-color";
import { gapi } from "gapi-script";
import "./Calendar.css";

const localizer = momentLocalizer(moment);

const CLIENT_ID =
  "773388467828-ppo5villgpsgakbktcoaucudp7b68shb.apps.googleusercontent.com";
const API_KEY = "AIzaSyDVFHdvhVQQCjI99gHM3VSXNJuB62boVEw";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

Modal.setAppElement("#root");

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    color: "#61dafb",
  });
  const [monthlyEvents, setMonthlyEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize client id
  useEffect(() => {
    // Load Google Identity Services
    const initializeGapiClient = async () => {
      await gapi.load("client:auth2", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });

        // Check if user is already logged in
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          setToken(accessToken);
          loadUserProfile(accessToken);
          loadCalendarEvents(accessToken);
        }
      });
    };

    initializeGapiClient();
  }, []);

  const loadUserProfile = (accessToken) => {
    const GoogleAuth = gapi.auth2.getAuthInstance();
    const user = GoogleAuth.currentUser.get();
    if (user.isSignedIn()) {
      setUser({
        name: user.getBasicProfile().getName(),
        email: user.getBasicProfile().getEmail(),
      });
    }
  };

  const handleAuthClick = async () => {
    try {
      const GoogleAuth = gapi.auth2.getAuthInstance();
      const user = await GoogleAuth.signIn();
      const accessToken = user.getAuthResponse().access_token;
      setUser({
        name: user.getBasicProfile().getName(),
        email: user.getBasicProfile().getEmail(),
      });
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken); // Store the token
      loadCalendarEvents(accessToken);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Load events from Google Calendar
  const loadCalendarEvents = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      const googleEvents = data.items.map((event) => ({
        id: event.id,
        title: event.summary || "No Title",
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        color: "#4285F4",
      }));
      setEvents(googleEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const handleSaveEvent = async () => {
    const startDate = moment(selectedDate)
      .set({
        hour: newEvent.startTime.split(":")[0],
        minute: newEvent.startTime.split(":")[1],
      })
      .toDate();
    const endDate = moment(selectedDate)
      .set({
        hour: newEvent.endTime.split(":")[0],
        minute: newEvent.endTime.split(":")[1],
      })
      .toDate();

    const eventToAdd = {
      summary: newEvent.title || "No Title",
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
    };

    try {
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventToAdd),
        }
      );
      loadCalendarEvents(token);
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadCalendarEvents(token);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setViewDate(date);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    openModal();
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewEvent({ title: "", startTime: "", endTime: "", color: "#61dafb" });
  };

  useEffect(() => {
    const filteredEvents = events.filter((event) =>
      moment(event.start).isSame(viewDate, "month")
    );
    setMonthlyEvents(filteredEvents);
  }, [viewDate, events]);

  return (
    <div className="App" style={{ display: "flex", margin: "20px" }}>
      <div className="small-calendar">
        {user ? (
          <h3>Welcome, {user.name}!</h3>
        ) : (
          <button onClick={handleAuthClick} className="auth-button">
            Connect with Google Calendar
          </button>
        )}
        <CalendarView onChange={handleDateChange} value={selectedDate} />
        <div className="event-summary">
          <h3>Events for {moment(viewDate).format("MMMM YYYY")}</h3>
          {monthlyEvents.length === 0 ? (
            <p>No events planned.</p>
          ) : (
            <ul>
              {monthlyEvents.map((event) => (
                <li key={event.id}>
                  {moment(event.start).format("MM/DD/YYYY")} - {event.title}
                  <button
                    onClick={() => handleDeleteEvent(event)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="big-calendar">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          date={viewDate}
          onNavigate={setViewDate}
          selectable
          onSelectSlot={({ start }) => handleDateClick(start)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              borderRadius: "5px",
              opacity: 0.8,
              color: "white",
              border: "0px",
            },
          })}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Event"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="event-input"
        />
        <div className="time-picker">
          <label>Start Time: </label>
          <input
            type="time"
            value={newEvent.startTime}
            onChange={(e) =>
              setNewEvent({ ...newEvent, startTime: e.target.value })
            }
          />
          <label style={{ marginLeft: "10px" }}>End Time: </label>
          <input
            type="time"
            value={newEvent.endTime}
            onChange={(e) =>
              setNewEvent({ ...newEvent, endTime: e.target.value })
            }
          />
        </div>
        <TwitterPicker
          color={newEvent.color}
          onChangeComplete={(color) =>
            setNewEvent({ ...newEvent, color: color.hex })
          }
        />
        <button onClick={handleSaveEvent} className="save-button">
          Save Event
        </button>
      </Modal>
    </div>
  );
};

export default Calendar;
