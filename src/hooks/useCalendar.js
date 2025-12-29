import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useCalendar(clientId = 'YOUR_CLIENT_ID') {
  const { user } = useAuth();
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gapi) return;

    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        apiKey: 'YOUR_API_KEY',  // Optional for public data; get from Console
        clientId: clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events',
      }).then(() => {
        setGapiLoaded(true);
        setCalendar(window.gapi.client.calendar);
        const authInstance = window.gapi.auth2.getAuthInstance();
        authInstance.isSignedIn.listen((isSignedIn) => {
          if (isSignedIn) {
            const currentUser = authInstance.currentUser.get();
            const authResponse = currentUser.getAuthResponse();
            setToken(authResponse.access_token);
          }
        });
      });
    });
  }, [clientId]);

  const syncTasks = async (tasks) => {
    if (!gapiLoaded || !token || !calendar) return;
    try {
      for (const task of tasks) {
        await calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: task.title,
            description: task.description || '',
            start: { dateTime: task.dueDate, timeZone: 'UTC' },
            end: { dateTime: new Date(new Date(task.dueDate).getTime() + 60 * 60 * 1000).toISOString(), timeZone: 'UTC' },
          },
        });
      }
      console.log('Tasks synced to Calendar');
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  };

  const importSchedules = async () => {
    if (!gapiLoaded || !token || !calendar) return [];
    try {
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });
      return res.result.items.map(event => ({
        title: event.summary,
        dueDate: event.start.dateTime,
        description: event.description,
      }));
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  };

  const signInToCalendar = async () => {
    if (!gapiLoaded) return;
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
    } catch (error) {
      console.error('Calendar sign-in failed:', error);
    }
  };

  const getAuthUrl = () => {
    if (!gapiLoaded) return '';
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance.currentUser.get().getAuthResponse().access_token ? '' : 'Auth required—call signInToCalendar';
  };

  return { syncTasks, importSchedules, signInToCalendar, getAuthUrl, token };
}