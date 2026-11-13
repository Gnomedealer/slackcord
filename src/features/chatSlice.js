import { createSlice } from "@reduxjs/toolkit";
import { createSeed } from "../data/seed";
import { colorFor, newId, toChannelName } from "../utils/format";

// All the community data: users, servers, channels, and messages.
// Stored "normalized" (objects keyed by id) so lookups are fast and
// each piece of data lives in exactly one place.

const chatSlice = createSlice({
  name: "chat",
  initialState: createSeed,
  reducers: {
    userCreated: {
      reducer(state, action) {
        const user = action.payload;
        state.users[user.id] = user;
        // New users join every server so they have somewhere to chat.
        Object.values(state.servers).forEach((server) => {
          if (!server.memberIds.includes(user.id)) server.memberIds.push(user.id);
        });
      },
      prepare(name) {
        return { payload: { id: newId("u"), name: name.trim(), color: colorFor(name.trim()) } };
      },
    },

    serverCreated: {
      reducer(state, action) {
        const { serverId, channelId, name, ownerId } = action.payload;
        state.servers[serverId] = { id: serverId, name, ownerId, memberIds: [ownerId], channelIds: [channelId] };
        state.channels[channelId] = { id: channelId, serverId, name: "general", topic: "" };
        state.serverOrder.push(serverId);
      },
      prepare({ name, ownerId }) {
        return { payload: { serverId: newId("s"), channelId: newId("c"), name: name.trim(), ownerId } };
      },
    },

    serverDeleted(state, action) {
      const server = state.servers[action.payload];
      if (!server) return;
      server.channelIds.forEach((channelId) => {
        Object.values(state.messages).forEach((m) => {
          if (m.channelId === channelId) delete state.messages[m.id];
        });
        delete state.channels[channelId];
      });
      delete state.servers[server.id];
      state.serverOrder = state.serverOrder.filter((id) => id !== server.id);
    },

    channelCreated: {
      reducer(state, action) {
        const { id, serverId, name, topic } = action.payload;
        state.channels[id] = { id, serverId, name, topic };
        state.servers[serverId].channelIds.push(id);
      },
      prepare({ serverId, name, topic = "" }) {
        return { payload: { id: newId("c"), serverId, name: toChannelName(name), topic: topic.trim() } };
      },
    },

    channelDeleted(state, action) {
      const channel = state.channels[action.payload];
      if (!channel) return;
      const server = state.servers[channel.serverId];
      if (server.channelIds.length <= 1) return; // a server always keeps one channel
      server.channelIds = server.channelIds.filter((id) => id !== channel.id);
      Object.values(state.messages).forEach((m) => {
        if (m.channelId === channel.id) delete state.messages[m.id];
      });
      delete state.channels[channel.id];
    },

    messageSent: {
      reducer(state, action) {
        state.messages[action.payload.id] = action.payload;
      },
      prepare({ channelId, authorId, body, replyToId = null }) {
        return {
          payload: {
            id: newId("m"),
            channelId,
            authorId,
            body: body.trim(),
            replyToId,
            createdAt: Date.now(),
            reactions: {},
          },
        };
      },
    },

    messageEdited(state, action) {
      const { id, body } = action.payload;
      const message = state.messages[id];
      if (message && body.trim()) {
        message.body = body.trim();
        message.editedAt = Date.now();
      }
    },

    messageDeleted(state, action) {
      delete state.messages[action.payload];
    },

    reactionToggled(state, action) {
      const { messageId, emoji, userId } = action.payload;
      const message = state.messages[messageId];
      if (!message) return;
      const users = message.reactions[emoji] || [];
      if (users.includes(userId)) {
        message.reactions[emoji] = users.filter((id) => id !== userId);
        if (message.reactions[emoji].length === 0) delete message.reactions[emoji];
      } else {
        message.reactions[emoji] = [...users, userId];
      }
    },
  },
});

export const {
  userCreated,
  serverCreated,
  serverDeleted,
  channelCreated,
  channelDeleted,
  messageSent,
  messageEdited,
  messageDeleted,
  reactionToggled,
} = chatSlice.actions;

export default chatSlice.reducer;
