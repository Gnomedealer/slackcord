import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SearchIcon from "@mui/icons-material/Search";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import HelpIcon from "@mui/icons-material/Help";
import SendIcon from "@mui/icons-material/Send";
const Chatareaheader = () => {
  return (
    <div className="flex p-6 justify-between items-center">
      <div>
        <h3 className=" text-xl flex items-center  text-white ">
          <span className="text-4xl font-bold text-gray-500 px-2">#</span>
        </h3>
      </div>

      <div className="flex items-center space-x-4 text-gray-500 justify-between">
        <NotificationsIcon className="space-x-2 hover:text-white cursor-pointer" />
        <PeopleAltIcon className="space-x-2 hover:text-white cursor-pointer" />
        <EditLocationIcon className="space-x-2 hover:text-white cursor-pointer" />
        <div className="search">
          <input
            type="text"
            className="bg-transparent text-white outline-0 border-none"
            placeholder="Search"
          />
          <SearchIcon className="hover:text-white cursor-pointer" />
        </div>
        <div className="flex items-center text-gray-500 space-x-4 justify-between">
          <SendIcon className="hover:text-white cursor-pointer" />
          <HelpIcon className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Chatareaheader;
