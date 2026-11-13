import { createSelector } from "@reduxjs/toolkit";

export const selectCurrentUser = (state) => state.chat.users[state.session.currentUserId] || null;
export const selectUsers = (state) => state.chat.users;

export const selectServers = createSelector(
  (state) => state.chat.serverOrder,
  (state) => state.chat.servers,
  (order, servers) => order.map((id) => servers[id]).filter(Boolean)
);

// Falls back to the first server if the saved one was deleted.
export const selectActiveServer = (state) =>
  state.chat.servers[state.session.activeServerId] || state.chat.servers[state.chat.serverOrder[0]] || null;

export const selectServerChannels = createSelector(
  selectActiveServer,
  (state) => state.chat.channels,
  (server, channels) => (server ? server.channelIds.map((id) => channels[id]).filter(Boolean) : [])
);

// Falls back to the server's first channel if none was picked yet.
export const selectActiveChannel = (state) => {
  const server = selectActiveServer(state);
  if (!server) return null;
  const savedId = state.session.channelByServer[server.id];
  const channelId = server.channelIds.includes(savedId) ? savedId : server.channelIds[0];
  return state.chat.channels[channelId] || null;
};

export const selectChannelMessages = createSelector(
  (state) => state.chat.messages,
  (state) => selectActiveChannel(state)?.id,
  (messages, channelId) =>
    Object.values(messages)
      .filter((m) => m.channelId === channelId)
      .sort((a, b) => a.createdAt - b.createdAt)
);
