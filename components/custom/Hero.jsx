"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "@/components/custom/SignInDialog";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Lookup from "@/data/Lookup";
import Colors from "@/data/Colors";
import { ArrowRight, Link, Loader2, Clock, Code2, Wand2 } from "lucide-react";

// Helper function to format relative time
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail, isLoadingUser } =
    useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace);
  const router = useRouter();

  // Fetch user's previous workspaces
  const workspaces = useQuery(
    api.workspace.GetAllWorkspace,
    userDetail?._id ? { userId: userDetail._id } : "skip"
  );

  useEffect(() => {
    console.log("UserDetail updated:", userDetail);
  }, [userDetail]);

  const onGenerate = async (input) => {
    if (!input?.trim()) return;

    console.log("onGenerate called with userDetail:", userDetail);

    if (isLoadingUser) {
      console.log("Still loading user...");
      return;
    }

    const msg = { role: "user", content: input };
    setMessages([msg]);

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

      setIsNavigating(true);
      router.push("/workspace/" + workspaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
      setIsLoading(false);
      setIsNavigating(false);
    }
  };

  const enhancePrompt = async () => {
    if (!userInput?.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      if (data.enhancedPrompt) {
        setUserInput(data.enhancedPrompt);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const navigateToWorkspace = (workspaceId) => {
    setIsNavigating(true);
    router.push("/workspace/" + workspaceId);
  };

  // Extract first user message from workspace
  const getWorkspaceTitle = (workspace) => {
    if (workspace?.messages && workspace.messages.length > 0) {
      const firstUserMsg = workspace.messages.find((m) => m.role === "user");
      if (firstUserMsg?.content) {
        return (
          firstUserMsg.content.slice(0, 60) +
          (firstUserMsg.content.length > 60 ? "..." : "")
        );
      }
    }
    return "Untitled Workspace";
  };

  return (
    <>
      {/* Navigation Loader Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-white text-lg font-medium">
              Moving to your workspace...
            </p>
          </div>
        </div>
      )}

      {/* Background Gradient Animation */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(5, 8, 25)"
        gradientBackgroundEnd="rgb(10, 15, 40)"
        firstColor="59, 130, 246"
        secondColor="139, 92, 246"
        thirdColor="34, 211, 238"
        fourthColor="124, 58, 237"
        fifthColor="56, 189, 248"
        pointerColor="103, 232, 249"
        size="80%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="fixed inset-0 -z-10"
      />

      {/* Hero Content */}
      <div className="flex flex-col items-center mt-24 xl:mt-36 gap-2 px-4">
        <h2 className="font-bold text-4xl text-center">
          Turn your{" "}
          <span className="font-['Press_Start_2P'] bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 animate-gradient">
            ideas
          </span>{" "}
          into{" "}
          <span className="font-['Press_Start_2P'] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 animate-gradient">
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
                  if (
                    userInput?.trim() &&
                    !isLoading &&
                    !isNavigating &&
                    !isEnhancing
                  ) {
                    onGenerate(userInput);
                  }
                }
              }}
              spellCheck={false}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
              disabled={isLoading || isNavigating || isEnhancing}
            />
            {userInput && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={enhancePrompt}
                  disabled={isEnhancing || isLoading || isNavigating}
                  className={`p-2 h-10 w-10 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isEnhancing || isLoading || isNavigating
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  } bg-emerald-500 hover:bg-emerald-600`}
                  title="Enhance prompt with AI"
                >
                  {isEnhancing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() =>
                    !isLoading &&
                    !isNavigating &&
                    !isEnhancing &&
                    onGenerate(userInput)
                  }
                  disabled={isLoading || isNavigating || isEnhancing}
                  className={`p-2 h-10 w-10 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isLoading || isNavigating || isEnhancing
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  } bg-blue-500 hover:bg-blue-600`}
                  title="Generate workspace"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
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
              onClick={() =>
                !isLoading && !isNavigating && !isEnhancing && onGenerate(s)
              }
              className="p-1 px-2 border rounded-full text-xs text-gray-400 hover:text-white cursor-pointer transition-colors"
            >
              {s}
            </h2>
          ))}
        </div>

        {/* Previous Workspaces Section */}
        {userDetail && workspaces && workspaces.length > 0 && (
          <div className="w-full max-w-6xl mt-12 mb-20">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="h-6 w-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">
                Your Recent Projects
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.slice(0, 6).map((workspace) => (
                <div
                  key={workspace._id}
                  onClick={() => navigateToWorkspace(workspace._id)}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden"
                >
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

                  <div className="relative z-10">
                    {/* Preview Section */}
                    <div className="bg-gray-950/50 rounded-lg p-3 mb-3 h-32 overflow-hidden border border-gray-700/50">
                      <div className="text-xs text-gray-400 font-mono overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {workspace.messages && workspace.messages.length > 0 ? (
                          workspace.messages.slice(0, 3).map((msg, idx) => (
                            <div key={idx} className="mb-2">
                              <span
                                className={
                                  msg.role === "user"
                                    ? "text-blue-400"
                                    : "text-purple-400"
                                }
                              >
                                {msg.role === "user" ? "You: " : "AI: "}
                              </span>
                              <span className="text-gray-300">
                                {msg.content.slice(0, 80)}
                                {msg.content.length > 80 ? "..." : ""}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No messages yet</span>
                        )}
                      </div>
                    </div>

                    {/* Workspace Info */}
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                        {getWorkspaceTitle(workspace)}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatRelativeTime(workspace._creationTime)}
                        </span>
                      </div>

                      {/* Messages count */}
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                          {workspace.messages?.length || 0} messages
                        </div>
                        {workspace.fileData && (
                          <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                            Has files
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover arrow indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              ))}
            </div>

            {workspaces.length > 6 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => router.push("/workspaces")}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  View all workspaces →
                </button>
              </div>
            )}
          </div>
        )}
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
