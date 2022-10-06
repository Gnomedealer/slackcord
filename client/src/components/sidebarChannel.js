import React from "react";
import { useDispatch } from "react-redux";
import setChannelInfo from "../features/appSlice";

const SidebarChannel = ({ id, channelName }) => {
  const dispatch = useDispatch();
  return (
    <div
      className=""
      onClick={() => {
        dispatch(
          setChannelInfo({
            channelId: id,
            channelName: channelName,
          })
        );
      }}
    >
      <h3 className="pl-6 cursor-pointer hover:bg-[#404646] hover:text-white flex items-center  text-gray-500">
        <span className="text-gray-400 p-2 text-2xl">#</span> {channelName}
      </h3>
    </div>
  );
};

export default SidebarChannel;
