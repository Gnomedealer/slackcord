import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    channelId: null,
    channelName: null,
    messages: [],
  },
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelId = action.payload.channelId;
      state.channelName = action.payload.channelName;
    },
    addmessage: (state, payload) => {
      messages.push(payload.newmessage)
    }
  },
  actions: {},
  // 
});

export const { setChannelInfo } = appSlice.actions;
export const messages = (state) => state.app.messages;
export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;

export default appSlice.reducer;






