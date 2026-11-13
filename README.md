# Slackcord

A chat app for communities, organized into **servers** and **channels**. Built with React and Redux Toolkit by **Tommy Nguyen**.

## Features

- **Servers & channels**: create servers (you become the owner) and add or delete channels
- **Messaging**: send, edit, and delete your own messages; Enter sends, Shift+Enter adds a new line
- **Replies**: reply to any message, and the original shows above your reply
- **Reactions**: react with 👍 ❤️ 😂 🎉 👀 and click a reaction to toggle it
- **@mentions**: messages that mention you are highlighted
- **Search**: filter the current channel's messages
- **Member list**: see who's in each server and who owns it
- **Saves automatically**: everything is stored in your browser's localStorage
- **Responsive**: works on phones with a slide-out menu, and follows your system's light/dark setting

It's a front-end app: there are no passwords, and data stays in the browser you use.

## Running it

```bash
npm install --legacy-peer-deps
npm start      # http://localhost:4000
npm test       # 18 tests
```

## How it's built

```
src/
  app/store.js          Redux store + saving to localStorage
  features/
    chatSlice.js        users, servers, channels, messages (normalized by id)
    sessionSlice.js     who's logged in, which server/channel is open
    selectors.js        derived data (active channel, sorted messages, ...)
  components/           Login, ServerRail, ChannelSidebar, ChatArea,
                        Message, Composer, MemberList, Modal, Avatar, Icons
  data/seed.js          demo community shown on first visit
  utils/format.js       ids, channel-name cleanup, avatar colors, dates
```

## Author

**Tommy Nguyen**: [github.com/Gnomedealer](https://github.com/Gnomedealer)
