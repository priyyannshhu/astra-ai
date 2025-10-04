"use client";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useContext } from "react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspaceData, {
      workspaceId: id,
    });
    setMessages(result?.messages);
    console.log(result);
  };

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  return (
    <div>
      <div>
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{
              backgroundColor: Colors.CHAT_BACKGROUND,
            }}
          >
            {msg?.role == "user" && (
              <Image src={userDetail?.picture} alt="userImage" 
              width={35} height={35} className='rounded-full'/>
            )}
            <h2>{msg.content}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatView;
