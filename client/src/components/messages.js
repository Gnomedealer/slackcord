import React from "react";
import { Avatar } from "@mui/material";

const messages = () => {
  return (
    <div>
      <div className="flex items-center p-5">
        <Avatar />
        <div>
          <h3 className="text-white ml-5">
            Gnomedealer
            <span className="text-xs ml-5 text-gray-500">
              this is the message
            </span>
          </h3>
          <h3 className="text-white ml-5">
            Hello, my name is Tommy Nguyen from San Jose, California. 
            My dream is to become a software engineer!
            Hello World!
            Testing Feature.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default messages;
