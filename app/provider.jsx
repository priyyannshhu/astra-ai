"use client";
import React, { useEffect } from "react";
import Header from "../components/custom/Header";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/custom/AppSidebar";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ActionContext } from "@/context/ActionContext";
import { useRouter } from "next/navigation";

const Provider = ({ children }) => {
  const [messages, setMessages] = React.useState();
  const [userDetail, setUserDetail] = React.useState();
  const [action, setAction] = React.useState();
  const [isLoadingUser, setIsLoadingUser] = React.useState(true); // Add this

  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    IsAuthenticated();
  }, []);

  const IsAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      //fetch from db
      if (!user) {
        setIsLoadingUser(false); // Done loading

        router.push("/");
        return;
      }
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetail(result);
      setIsLoadingUser(false); // Done loading

      console.log(result);
    }
  };

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
      >
        {/* <PayPalScriptProvider
          options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
        > */}
        <UserDetailContext.Provider
          value={{ userDetail, setUserDetail, isLoadingUser }}
        >
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider
                attribute="class"
                enableSystem
                defaultTheme="dark"
                disableTransitionOnChange
              >
                <Header />

                {children}
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
        {/* </PayPalScriptProvider> */}
      </GoogleOAuthProvider>
    </div>
  );
};

export default Provider;