class GoogleCalendarService {
  constructor() {
    this.gapi = null;
    this.tokenClient = null;
    this.isSignedIn = false;
    this.currentUser = null;
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/calendar';
  }

  async initialize() {
    if (this.gapi && this.tokenClient) return this.gapi;

    return new Promise((resolve, reject) => {
      let gapiLoaded = false;
      let gisLoaded = false;

      const maybeInitialize = async () => {
        if (gapiLoaded && gisLoaded) {
          try {
            await window.gapi.client.init({
              apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
              discoveryDocs: [this.DISCOVERY_DOC],
            });
            this.gapi = window.gapi;

            this.tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              scope: this.SCOPES,
              callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                  this.isSignedIn = true;
                  // Dispatch a custom event so the UI knows we connected successfully
                  window.dispatchEvent(new CustomEvent('google-calendar-connected'));
                }
              },
            });

            resolve(this.gapi);
          } catch (error) {
            console.error("Error initializing Google API:", error);
            reject(error);
          }
        }
      };

      // Load GAPI client for API requests
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.onload = () => {
        window.gapi.load('client', () => {
          gapiLoaded = true;
          maybeInitialize();
        });
      };
      gapiScript.onerror = reject;
      document.head.appendChild(gapiScript);

      // Load Google Identity Services for Authentication
      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = () => {
        gisLoaded = true;
        maybeInitialize();
      };
      gisScript.onerror = reject;
      document.head.appendChild(gisScript);
    });
  }

  async signIn() {
    if (!this.tokenClient) await this.initialize();

    return new Promise((resolve, reject) => {
      try {
        // Override the callback just for this sign-in request
        this.tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            reject(resp);
          }
          this.isSignedIn = true;
          resolve(resp);
        };
        // Trigger the Google popup
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        console.error("Sign-in error", err);
        reject(err);
      }
    });
  }

  async signOut() {
    if (this.gapi) {
      const token = this.gapi.client.getToken();
      if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
          this.gapi.client.setToken('');
          this.isSignedIn = false;
        });
      }
    }
  }

  async getEvents(timeMin = new Date(), timeMax = null) {
    if (!this.isSignedIn) throw new Error('Not signed in to Google Calendar');

    const maxDate = timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: maxDate.toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items.map(event => ({
        id: event.id,
        title: event.summary || 'No Title',
        description: event.description || '',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        location: event.location || '',
        attendees: event.attendees || [],
        isAllDay: !event.start.dateTime,
        status: event.status,
        htmlLink: event.htmlLink
      }));
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw error;
    }
  }

  async createEvent(eventData) {
    if (!this.isSignedIn) throw new Error('Not signed in to Google Calendar');

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: eventData.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: eventData.location || '',
      attendees: eventData.attendees || []
    };

    try {
      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });
      return response.result;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw error;
    }
  }

  async updateEvent(eventId, eventData) {
    if (!this.isSignedIn) throw new Error('Not signed in to Google Calendar');

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: eventData.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: eventData.location || ''
    };

    try {
      const response = await this.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
      });
      return response.result;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    if (!this.isSignedIn) throw new Error('Not signed in to Google Calendar');

    try {
      await this.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      return true;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      throw error;
    }
  }

  async getCalendarList() {
    if (!this.isSignedIn) throw new Error('Not signed in to Google Calendar');

    try {
      const response = await this.gapi.client.calendar.calendarList.list();
      return response.result.items.map(calendar => ({
        id: calendar.id,
        name: calendar.summary,
        description: calendar.description || '',
        primary: calendar.primary || false,
        accessRole: calendar.accessRole,
        backgroundColor: calendar.backgroundColor
      }));
    } catch (error) {
      console.error('Failed to fetch calendar list:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return this.isSignedIn;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new GoogleCalendarService();