"use client";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { ArrowRight, Link, Loader2Icon, Bot, AlertCircle } from "lucide-react";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ReactMarkdown from "react-markdown";
// import { useSidebar } from "@/components/ui/sidebar";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const { toggleSidebar } = useSidebar();

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

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1]?.role;
      if (role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    setError(null);

    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      console.log("Sending prompt:", PROMPT);

      const result = await axios.post("/api/ai-chat", {
        prompt: PROMPT,
      });

      console.log("AI Response:", result.data.result);

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: result.data.result },
      ]);
    } catch (err) {
      console.error("Error getting AI response:", err);
      console.error("Error details:", err.response?.data);

      setError(
        err.response?.data?.error ||
          "Failed to get AI response. Please try again."
      );

      // Remove the last user message if AI fails
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async (input) => {
    if (!input?.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserInput(""); // Clear input immediately
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      {/* Messages Container with Custom Scrollbar */}
      <div className="flex-1 overflow-y-scroll px-4 scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${msg?.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg flex gap-2 items-start leading-7 ${
                msg?.role === "user" ? "ml-auto" : "mr-auto"
              }`}
              style={{
                backgroundColor:
                  msg?.role === "user" ? "#3A3A3A" : Colors.CHAT_BACKGROUND,
                color: "#FFFFFF",
              }}
            >
              {msg?.role === "user" ? (
                <>
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                  <Image
                    src={userDetail?.picture}
                    alt="userImage"
                    width={35}
                    height={35}
                    className="rounded-full flex-shrink-0"
                  />
                </>
              ) : (
                <>
                  <div className="bg-purple-500 rounded-full p-2 flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 prose prose-invert prose-sm max-w-none">
                    <div className="font-semibold text-purple-600 mb-1 not-prose">
                      Astra AI
                    </div>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc ml-4 mb-2 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal ml-4 mb-2 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed">{children}</li>
                        ),
                        code: ({ inline, children }) =>
                          inline ? (
                            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm">
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-gray-800 p-3 rounded my-2 overflow-x-auto">
                              {children}
                            </code>
                          ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-2 mt-3">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold mb-2 mt-3">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-bold mb-2 mt-2">
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-3">
            <div
              className="max-w-[75%] p-3 rounded-lg flex gap-2 items-center"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              <div className="bg-purple-500 rounded-full p-2">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-purple-600 mb-1">AI</div>
                <div className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin h-4 w-4" />
                  <h2>Generating response...</h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start mb-3">
            <div
              className="max-w-[75%] p-3 rounded-lg flex gap-2 items-start"
              style={{ backgroundColor: "#991B1B", color: "#FFFFFF" }}
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-semibold mb-1">Error</div>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Input Section */}
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
                if (userInput?.trim()) {
                  onGenerate(userInput);
                }
              }
            }}
            spellCheck={false}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            disabled={loading}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className={`bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>{" "}
    </div>
  );
}

export default ChatView;