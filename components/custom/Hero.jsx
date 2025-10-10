"use client";
import React, { useContext, useState, useEffect } from "react";
import Lookup from "@/data/Lookup";
import Colors from "@/data/Colors";
import { MessagesContext } from "@/context/MessagesContext";
import { ArrowRight, Link, Loader2 } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "@/components/custom/SignInDialog";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail, isLoadingUser } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace);
  const router = useRouter();

  // Add useEffect to debug userDetail
  useEffect(() => {
    console.log("UserDetail updated:", userDetail);
  }, [userDetail]);

  const onGenerate = async (input) => {
    if (!input?.trim()) return;
    
    console.log("onGenerate called with userDetail:", userDetail);
    
    // Wait for user initialization to complete
    if (isLoadingUser) {
      console.log("Still loading user...");
      return;
    }
    
    const msg = { role: "user", content: input };
    setMessages([msg]);

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

      // Show navigation loader
      setIsNavigating(true);
      router.push("/workspace/" + workspaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
      setIsLoading(false);
      setIsNavigating(false);
    }
  };

  return (
    <>
      {/* Navigation Loader Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-white text-lg font-medium">Moving to your workspace...</p>
          </div>
        </div>
      )}

      {/* Background Gradient Animation - positioned fixed behind everything */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 0)"
        gradientBackgroundEnd="rgb(10, 10, 30)"
        firstColor="59, 130, 246"
        secondColor="139, 92, 246"
        thirdColor="96, 165, 250"
        fourthColor="147, 51, 234"
        fifthColor="79, 70, 229"
        pointerColor="99, 102, 241"
        size="80%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="fixed inset-0 -z-10"
      />

      {/* Hero Content */}
      <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
        <h2 className="font-bold text-4xl text-center px-4">
          Turn your{" "}
          <span className="font-['Press_Start_2P'] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-300 animate-gradient">
            ideas
          </span>{" "}
          into{" "}
          <span className="font-['Press_Start_2P'] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-300 animate-gradient">
            apps
          </span>{" "}
          instantly
        </h2>
        <p className="text-gray-100 font-medium">{Lookup.HERO_DESC}</p>

        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3"
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              value={userInput}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (userInput?.trim() && !isLoading && !isNavigating) {
                    onGenerate(userInput);
                  }
                }
              }}
              spellCheck={false}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
              disabled={isLoading || isNavigating}
            />
            {userInput && (
              <ArrowRight
                onClick={() => !isLoading && !isNavigating && onGenerate(userInput)}
                className={`bg-blue-500 p-2 h-10 w-10 rounded-md flex-shrink-0 ${
                  isLoading || isNavigating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
              onClick={() => !isLoading && !isNavigating && onGenerate(s)}
              className="p-1 px-2 border rounded-full text-xs text-gray-400 hover:text-white cursor-pointer transition-colors"
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