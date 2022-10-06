import React, { useEffect, useState } from "react";
import "./sidebar.css";
import MicIcon from "@mui/icons-material/Mic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SidebarChannel from "./sidebarChannel";
import HeadsetIcon from "@mui/icons-material/Headset";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CallIcon from "@mui/icons-material/Call";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "./firbase";
import db from "./firbase";

const Sidebar = () => {
  const user = useSelector(selectUser);

  const [channels, setChannels] = useState([]);
  useEffect(() => {
    db.collection("channels").onSnapshot((snapshot) =>
      setChannels(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          channel: doc.data(),
        }))
      )
    );
  }, []);

  const addChannel = () => {
    const channelName = prompt("Create a new Channel");
    if (channelName) {
      db.collection("channels").add({
        channelName: channelName,
      });
    }
  };
  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <h3 className="text-xl">slackcord</h3>
        <ExpandMoreIcon />
      </div>
      <div className="sidebar__channels">
        <div className="sidebar__channelsHeader text-lg text-gray-400 p-4 justify-between items-center flex">
          <div className="flex space-x-4 flex-1 text-gray-500 items-center">
            <ExpandMoreIcon />
            <h2>Text-Channel</h2>
          </div>
          <AddIcon
            onClick={addChannel}
            className="hover:text-white cursor-pointer"
          />
        </div>
        <div className="sidebar__channel">
          {channels.map(({ id, channel }) => (
            <SidebarChannel
              key={id}
              id={id}
              channelName={channel.channelName}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="text-[#4fb185] bg-[#2f3135] border-t-2 p-2 border-[#26282c] flex items-center justify-center">
          <SignalCellularAltIcon fontSize="large" />
          <div className="text-gray-500 flex-1 p-2">
            <h3 className="text-[#4fb185]">Voice Connected</h3>
            <p className="text-xs">server-US</p>
          </div>
          <div className="md:space-x-3">
            <InfoOutlinedIcon />
            <CallIcon />
          </div>
        </div>
      </div>
      <div className="flex border-t-2 p-2 border-[#26282c] justify-around items-center">
        <Avatar
          className="cursor-pointer"
          onClick={() => auth.signOut()}
          src={user.photo}
        />
        <div className="text-white p-2 flex-1">
          <h3 className="font-bold">@{user.displayName}</h3>
          <h3 className="text-xs">#{user.uid.substring(0, 5)}</h3>
        </div>
        <div className="text-gray-500 flex flex-col cursor-pointer md:flex-row md:space-x-3">
          <MicIcon className=" hover:text-white" />
          <HeadsetIcon className=" hover:text-white" />
          <SettingsIcon className=" hover:text-white" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
