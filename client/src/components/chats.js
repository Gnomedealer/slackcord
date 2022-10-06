import React from "react";
import Messages from "./messages";
import "./test.css"
import { useSelector } from "react-redux";
import { messages } from "../features/appSlice";
const Chats = () => {
  const messagesTexts = useSelector(messages);
  const messageDivs = messagesTexts.map((m) => {
    return(<div>
      {m}
    </div>)
  }) 
  return (
    <div className="chatareamessage">
      <Messages/>
      <Messages/>
      <Messages/>
      <Messages/>
      <Messages/>
      <Messages/>
      <Messages/>
      {/* {messageDivs}   */}
    </div>
  );
};

export default Chats;
