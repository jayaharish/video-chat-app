import React from "react";
import SocketContext from "./socket-context";
import UserUtil from "./UserUtil";

function User({id}){
    return (
        <SocketContext.Consumer>
            {socket=>(
                <UserUtil id={id} socket={socket}></UserUtil>
            )}
        </SocketContext.Consumer>
    )
}

export default User;