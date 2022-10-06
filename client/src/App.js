import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Chatarea from "./components/Chatarea";
import { auth } from "./components/firbase";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import { login, selectUser, logout } from "./features/userSlice.js";

function App() {
  const dispatch= useDispatch();
  const user = useSelector(selectUser);
  

  useEffect(()=>{
    auth.onAuthStateChanged((authUser)=>{
      
      if (authUser){
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName,
          })
        )
      }
      else{
          dispatch(logout())
      }

    })
  }, [dispatch])
  


  return (
    <div className="overflow-y-hidden">
      {user ? (
        <div className="flex">
          <Sidebar />
          <Chatarea />
        </div>
      ) : (
        <Login/>
      )}
    </div>
  );
}

export default App;
