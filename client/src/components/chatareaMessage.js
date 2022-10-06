import React, { useState } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GifIcon from "@mui/icons-material/Gif";
import { useSelector } from "react-redux";
import { selectChannelId } from "../features/appSlice";
import "./test.css"

const ChatareaMessage = () => {
  const channelId= useSelector(selectChannelId);


  const[input, setInput]=useState("")
  return (
    <div className="flex p-4 m-5 text-gray-300 items-center border-t-2 rounded-lg cursor-pointer border-gray-500 justify-between bg-[#474b53]">
      <AddCircleRoundedIcon className="hover:text-white" fontSize="large" />
      <form className="chatareamessage">
        <input
          className="w-full bg-transparent outline-0 text-xl text-gray-300 p-5"
          value={input}
          onChange={(e)=>{
            setInput(e.target.value)

          }}
          
          placeholder={"Send Message"}
        />
        <button className="hidden">Send Message</button>
      </form>

      <div className="p-3 space-x-4">
        <CardGiftcardRoundedIcon className="hover:text-white" fontSize="large" />
        <GifIcon className="hover:text-white" fontSize="large" />
        <EmojiEmotionsIcon className="hover:text-white" fontSize="large" />
      </div>
    </div>
  );
};

export default ChatareaMessage;
