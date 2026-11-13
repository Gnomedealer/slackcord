import { createSlice } from "@reduxjs/toolkit";
import { serverCreated, userCreated, channelCreated } from "./chatSlice";

// Who is logged in and which server/channel they're looking at.
const sessionSlice = createSlice({
  name: "session",
  initialState: {
    currentUserId: null,
    activeServerId: null,
    channelByServer: {}, // remembers the last channel you opened in each server
  },
  reducers: {
    loggedIn(state, action) {
      state.currentUserId = action.payload;
    },
    loggedOut(state) {
      state.currentUserId = null;
    },
    serverSelected(state, action) {
      state.activeServerId = action.payload;
    },
    channelSelected(state, action) {
      const { serverId, channelId } = action.payload;
      state.activeServerId = serverId;
      state.channelByServer[serverId] = channelId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userCreated, (state, action) => {
        state.currentUserId = action.payload.id;
      })
      .addCase(serverCreated, (state, action) => {
        state.activeServerId = action.payload.serverId;
        state.channelByServer[action.payload.serverId] = action.payload.channelId;
      })
      .addCase(channelCreated, (state, action) => {
        state.channelByServer[action.payload.serverId] = action.payload.id;
      });
  },
});

export const { loggedIn, loggedOut, serverSelected, channelSelected } = sessionSlice.actions;
export default sessionSlice.reducer;
