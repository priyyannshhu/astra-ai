"use client";
import { createContext, useState, useEffect } from "react";

// Create and export the context
export const UserDetailContext = createContext();

// Export the provider component
export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log("Loaded user from localStorage:", parsedUser);
          setUserDetail(parsedUser);
        } catch (error) {
          console.error("Error parsing saved user:", error);
        }
      }
      setIsLoadingUser(false);
    }
  }, []);

  return (
    <UserDetailContext.Provider
      value={{ userDetail, setUserDetail, isLoadingUser }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};
