//npm install react-calendar react-big-calendar moment react-moment 
//npm install react-modal emoji-picker-react react-color
//npm install gapi-script

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { TwitterPicker } from 'react-color';
import { gapi } from 'gapi-script';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const clientId = '';
const apiKey = '';

Modal.setAppElement('#root');

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    color: '#61dafb'
  });
  const [monthlyEvents, setMonthlyEvents] = useState([]);
  const [user, setUser] = useState(null);

  // Initialize client id
  useEffect(() => {
    const initClient = () => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          });
          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance.isSignedIn.get()) {
            const currentUser = authInstance.currentUser.get().getBasicProfile();
            setUser({
              name: currentUser.getName(),
              email: currentUser.getEmail(),
            });
            loadCalendarEvents();
          }
        } catch (error) {
          console.error('Error initializing Google API client:', error);
        }
      });
    };
    initClient();
  }, []);

  //google sigin
  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      const currentUser = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
      setUser({
        name: currentUser.getName(),
        email: currentUser.getEmail(),
      });
      loadCalendarEvents();
    });
  };

  //to load events from g calendar
  const loadCalendarEvents = () => {
    gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    }).then((response) => {
      const googleEvents = response.result.items.map((event, index) => ({
        id: event.id || index,
        title: event.summary || 'No Title',
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        color: '#4285F4',  // Default colour
      }));
      setEvents([...events, ...googleEvents]);
    }).catch(error => {
      console.error('Error loading Google Calendar events:', error);
    });
  };

  // Handle date change in small calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setViewDate(date);
  };

  // handle click on a date
  const handleDateClick = (date) => {
    setSelectedDate(date);
    openModal();
  };

  // modal management
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewEvent({ title: '', startTime: '', endTime: '', color: '#61dafb' });
  };

  // Save a new event and add to Google Calendar
  const handleSaveEvent = () => {
    // defaukt event
    const eventTitle = newEvent.title.trim() === '' ? 'No Title' : newEvent.title;

    // default to the beginning and end of the day if times are not provided
    const startDate = newEvent.startTime
      ? moment(selectedDate).set({
          hour: newEvent.startTime.split(':')[0],
          minute: newEvent.startTime.split(':')[1]
      }).toDate()
      : moment(selectedDate).startOf('day').toDate();

    const endDate = newEvent.endTime
      ? moment(selectedDate).set({
          hour: newEvent.endTime.split(':')[0],
          minute: newEvent.endTime.split(':')[1]
      }).toDate()
      : moment(selectedDate).endOf('day').toDate();

    // endDate is after startDate
    if (endDate <= startDate) {
      alert("End time must be after start time.");
      return;
    }

    const eventToAdd = {
      id: Date.now(),
      title: eventTitle,
      start: startDate,
      end: endDate,
      allDay: false,
      color: newEvent.color,
    };

    setEvents([...events, eventToAdd]);

    gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: eventTitle,
        start: { dateTime: startDate.toISOString(), timeZone: 'America/Los_Angeles' },
        end: { dateTime: endDate.toISOString(), timeZone: 'America/Los_Angeles' },
      }
    }).then(() => loadCalendarEvents()).catch(error => {
      console.error('Error saving event to Google Calendar:', error);
    });

    closeModal();
  };

  // delete an event
  const handleDeleteEvent = (eventToDelete) => {
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventToDelete.id
    }).then(() => loadCalendarEvents()).catch(error => {
      console.error('Error deleting Google Calendar event:', error);
    });
  };

  // update monthly events on view date change
  useEffect(() => {
    const filteredEvents = events.filter(event => moment(event.start).isSame(viewDate, 'month'));
    setMonthlyEvents(filteredEvents);
  }, [viewDate, events]);

  return (
    <div className="App" style={{ display: 'flex', margin: '20px' }}>
      <div className="small-calendar">
        {user ? (
          <h3>Welcome, {user.name}!</h3>
        ) : (
          <button onClick={handleAuthClick} className="auth-button">Connect with Google Calendar</button>
        )}
        <Calendar onChange={handleDateChange} value={selectedDate} />
        <div className="event-summary">
          <h3>Events for {moment(viewDate).format('MMMM YYYY')}</h3>
          {monthlyEvents.length === 0 ? (
            <p>No events planned.</p>
          ) : (
            <ul>
              {monthlyEvents.map((event) => (
                <li key={event.id}>
                  {moment(event.start).format('MM/DD/YYYY')} - {event.title}
                  <button onClick={() => handleDeleteEvent(event)} className="delete-button">Delete</button>
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
              borderRadius: '5px',
              opacity: 0.8,
              color: 'white',
              border: '0px',
            }
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
            onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
          />
          <label style={{ marginLeft: '10px' }}>End Time: </label>
          <input
            type="time"
            value={newEvent.endTime}
            onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
          />
        </div>
        <TwitterPicker
          color={newEvent.color}
          onChangeComplete={(color) => setNewEvent({ ...newEvent, color: color.hex })}
        />
        <button onClick={handleSaveEvent} className="save-button">Save Event</button>
        <button onClick={closeModal} className="cancel-button">Cancel</button>
      </Modal>
    </div>
  );
};

export default App;
