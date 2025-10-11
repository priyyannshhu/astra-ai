"use client";
import { createContext, useState, useCallback } from "react";

export const ActionContext = createContext();

export function ActionProvider({ children }) {
  const [action, setAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = useCallback(async (actionType, payload = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      switch (actionType) {
        case "export":
          // Handle export logic
          console.log("Exporting code...");
          break;

        case "deploy":
          // Handle deploy logic
          console.log("Deploying code...");
          break;

        case "pushToGithub":
          // Handle GitHub push logic
          await handleGitHubPush(payload);
          break;

        default:
          console.log("Unknown action:", actionType);
      }

      setAction({
        actionType: actionType,
        timeStamp: Date.now(),
        ...payload,
      });
    } catch (err) {
      setError(err.message);
      console.error("Action error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGitHubPush = async (payload) => {
    const {
      repoName = "astra-ai-project",
      isPrivate = false,
      commitMessage = "Initial commit from Astra AI",
      workspaceCode,
    } = payload;

    // Get GitHub token from cookies
    const cookies = document.cookie
      .split(";")
      .find((c) => c.includes("github_token"));

    if (!cookies) {
      throw new Error(
        "GitHub token not found. Please authenticate with GitHub first."
      );
    }

    const githubToken = cookies.split("=")[1];

    try {
      // 1. Create repository on GitHub
      const createRepoResponse = await fetch(
        "https://api.github.com/user/repos",
        {
          method: "POST",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: repoName,
            description: "Generated from Astra AI",
            private: isPrivate,
            auto_init: true,
          }),
        }
      );

      if (!createRepoResponse.ok) {
        const errorData = await createRepoResponse.json();
        throw new Error(errorData.message || "Failed to create repository");
      }

      const repoData = await createRepoResponse.json();
      const { owner, name } = repoData;

      // 2. Upload files to the repository
      // Using GitHub's content API to upload files
      const files = workspaceCode || {}; // Should be an object with filename: content pairs

      for (const [filename, content] of Object.entries(files)) {
        await fetch(
          `https://api.github.com/repos/${owner.login}/${name}/contents/${filename}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: commitMessage,
              content: btoa(content), // Base64 encode the content
            }),
          }
        );
      }

      console.log(`✅ Successfully pushed to GitHub: ${repoData.html_url}`);
      return repoData;
    } catch (error) {
      console.error("GitHub push error:", error);
      throw error;
    }
  };

  const value = {
    action,
    setAction,
    isLoading,
    error,
    handleAction,
  };

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}
