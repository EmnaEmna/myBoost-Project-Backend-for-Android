import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  '***************.apps.googleusercontent.com',
  '*****************',
  'http://localhost:9090/google/redirect'
);

const scopes = ['https://www.googleapis.com/auth/calendar'];
const token = "";

const generateAuthUrl = (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
};

const handleRedirect = async (req, res) => {
  console.log(req.query);
  const code = req.query.code;

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  console.log(tokens);

  res.send({
    msg: 'You have successfully logged in',
  });
};

const scheduleEvent = async (req, res) => {
    console.log(oAuth2Client.credentials.access_token);
  
    await calendar.events.insert({
      calendarId: 'primary',
      auth: oAuth2Client,
      conferenceDataVersion: 1,
      requestBody: {
        'summary': 'this is myBoost event',
        'description': 'MyBoost deadline task.',
        'start': {
          'dateTime': '2023-10-28T09:00:00-07:00',
          'timeZone': 'Africa/Tunis',
        },
        'end': {
          'dateTime': '2023-11-28T17:00:00-07:00',
          'timeZone': 'Africa/Tunis',
        },
        'conferenceData': {
          createRequest: { requestId: uuid() },
        },
        'attendees': [
          { 'email': 'emna.meknii@gmail.com' },
        ],
      },
    });
  
    res.send({
      msg: "Done",
    });
  };
  

  

export { generateAuthUrl, handleRedirect,scheduleEvent };
