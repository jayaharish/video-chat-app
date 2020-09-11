import React, { useState, useEffect,useRef } from 'react';
import Webcam from "./webcam";
import './App.css';
import userBg from "./user-bg.png";
import io from "socket.io-client";

const socket = io("http://localhost:9999");

function App() {
  const [users,setusers] = useState({});
  
  useEffect(()=>{
    socket.on('user-in',function(id){
      console.log(id+" came");
      setusers(prev=>({...prev,[id]:userBg}));
    });
    socket.on('user-out',function(id){
      setusers(prev=>({...prev,[id]:undefined}));
    });
    socket.on('user-list',function(usersList){
      let temp = {};
      usersList.forEach(user => {
        temp[user] = userBg;
      });
      setusers(temp);
    });
    socket.on('new-image',function(id,image){
      var urlCreator = window.URL || window.webkitURL;
      var arrayBufferView = new Uint8Array(image);
      var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      var imageUrl = urlCreator.createObjectURL(blob);
      setusers(prev=>({...prev,[id]:imageUrl}));
    });
  },[]);

  return (
    <div className="App">
      <Webcam socket={socket}></Webcam>
      {Object.keys(users).map(user=>{
        if(!users[user] || user === socket.id)return null;
        return (<img key={user} src={users[user]}/>)
      })}
    </div>
  );
}

export default App;
