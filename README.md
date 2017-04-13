# RealTimeWeb
Repository for the course Real Time Web, part of the minor Everything Web at the Hogeschool van Amsterdam.
The assignment was to build a real-time web application.

## About this application
This is a basic chat room app that allows users to select a username, enter the chatroom and talk to eachother.

## Live version
See the app live at: http://146.185.138.164:3000/

## Features
The app has a couple of basic features.
* Set username
  * Check if username is available yes/no
* Chat with people in the chatroom
* Play chat sound on new message when browser or browsertab is not in focus
* See which users are online

## The tech
Built on Node.js as the backend runtime.
The server is provided by Express, the Node.js package.
The real-time connection is done with websockets, and was achieved with the Socket.io package.

## Installation and usage
To get the application up and running:

```
git clone https://github.com/TuriGuilano/realtime-web/tree/master/week1
cd repository

npm install --save

npm start
// Or
nodemon server.js
```

## Contribution
I'd love some feedback on my projects. Fork it, if you like.

## Known issues/bugs
* Not yet responsive
* Online users function sometimes overwrites itself on the same line in stead of appending a new list item

## Wishlist
* Completely responsive for use on mobile
* Convert into progressive web app
* Add 'user is typing' feature
* Add user profile pictures
* Add persistent chat data
* Restyle to resemble text clouds (like iMessage)
* Emoticons

## External sources
Had a little help from Traversy Media on YouTube: https://www.youtube.com/watch?v=tHbCkikFfDE,
and the Socket.io tutoral at https://socket.io/get-started/chat/
