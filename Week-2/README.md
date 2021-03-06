# Real-time Web App with Spotify & Twitter integration

## TO DO (required)
1. Use better data model (mongo?), is being sent to client immediately right now. 
2. Catch network loss. What happens when connection between server and client is lost for a short while?
3. Multi-user/multi-client support
4. Deploy to Heroku/Now/DigitalOcean
5. Elaborate documentation (with codecomments, screenshots etc.)
6. Use seperate repo
7. No nested functions, declare in objects
8. Use module based setup (ie. routes in router.js)

## About the app
This application is the result of the assignments for the course Real Time Web. The assignment was to create a webapplication
that renders data from an external source (API) of one's own choosing and create a real-time connection between the server and the client to send data from the API.

The application allows the user to see what their top 20 artists are on Spotify
and what people tweet about these artists.

## App Flow
The user is presented a welcome screen which prompts the user to log in with their Spotify account.
After the user clicks the login button an OAuth procedure starts, asking for the user's permission to access some of said users information.
The application then retrieves this information from the Spotify API and redirects to the main view, showing the user's top 20 artists.
When all data is loaded, the user can see what track they listened to most recently and click one of the top 20 artists to start the Twitter feed.
The user is presented a page showing a real-time Twitter stream about the chosen artist.

As an extra feature, a list of currently active users is displayed in the main view.

## Dependencies
 * Express
 * Socket.io
 * Twitter (npm package)
 * EJS
 * Dotenv
 * Request
 * Compression

## Known Issues
* Going to one of the twitter feed pages logs the user out of the 'currently active' state and is thus not visible on the main view for other users.
* Most Recent Track doesn't update properly
* The same Twitter stream is shared between all artists, also showing some tweets from previously selected artists.
* App crash on slow networks
* Refreshing the main view throws an error

## Wishlist
* Real-time 'Most Recently Played' feature
* Better user feedback on 'tunnel' events
* Relocate Twitter stream to main view
* See top artists of other (online) users (profile system)
* User feedback on data loading (loading spinner)
* Responsive Design

## Installation

### NOTE: For the app to work you need to create a .env file with the following variables:
```
// Spotify: get these at https://developer.spotify.com/my-applications/#!/applications

CLIENT_SECRET=<spotify client secret>

CLIENT_ID=<spotify client ID>

RESPONSE_TYPE=code

GRANT_TYPE=authorization_code

SCOPE=user-top-read user-read-private user-read-currently-playing user-read-playback-state

REDIRECT_URI=http://localhost:3000/login

// Twitter: get these at https://apps.twitter.com/

TWITTER_CONS_KEY=<twitter consumer key>

TWITTER_CONS_SECRET=<twitter consumer secret>

TWITTER_ACCESS_TOKEN=<twitter access token>

TWITTER_TOKEN_SECRET=<twitter token secret>
```

1. Clone this repo
2. Go to directory
3. Install dependencies with
```
npm install
```
4. Run app with
```
node app.js
```
5. Go to http://localhost:3000 to test app
