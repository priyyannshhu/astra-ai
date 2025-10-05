"use client";
import React, { useContext, useState, useEffect } from "react";
import Lookup from "@/data/Lookup";
import Colors from "@/data/Colors";
import { MessagesContext } from "@/context/MessagesContext";
import { ArrowRight, Link } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "@/components/custom/SignInDialog";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

function Hero() {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace);
  const router = useRouter();

  // Add useEffect to debug userDetail
  useEffect(() => {
    console.log("UserDetail updated:", userDetail);
  }, [userDetail]);

  const onGenerate = async (input) => {
    console.log("onGenerate called with userDetail:", userDetail);
    
    const msg = { role: "user", content: input };
    setMessages(msg);

    // Check if userDetail is loaded and has _id
    if (!userDetail || !userDetail._id) {
      console.log("User not authenticated, opening dialog");
      setOpenDialog(true);
      return;
    }

    try {
      setIsLoading(true);
      const workspaceId = await CreateWorkspace({
        user: userDetail._id,
        messages: [msg],
      });

      router.push("/workspace/" + workspaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
        <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
        <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>

        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3 "
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(e) => setUserInput(e.target.value)}
              spellCheck={false}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none "
              disabled={isLoading}
            />
            {userInput && (
              <ArrowRight
                onClick={() => !isLoading && onGenerate(userInput)}
                className={`bg-blue-500 p-2 h-10 w-10 rounded-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
        <div className="flex mt-5 flex-wrap max-w-2xl items-center justify-center gap-3">
          {Lookup?.SUGGESTIONS.map((s, index) => (
            <h2
              key={index}
              onClick={() => !isLoading && onGenerate(s)}
              className="p-1 px-2 border rounded-full text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              {s}
            </h2>
          ))}
        </div>
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center text-xs text-gray-400">
        <span>© Copyright Astra AI</span>
        <span>
          Created by{" "}
          <a
            href="https://github.com/priyyannshhu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Priyanshu Vishwakarma
          </a>
        </span>
      </div>
    </>
  );
}

export default Hero;