import React from "react";
import Chatarea__Header from "./chatareaheader";
import Chats from "./chats";
import Chatarea__message from "./chatareaMessage";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectChannelId, selectChannelName } from "../features/appSlice";

const Chatarea = () => {
  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  return (
    <div className="chatarea">
      <Chatarea__Header  />
      <Chats />
      <Chatarea__message />
    </div>
  );
};

export default Chatarea;
