import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { User, Lock, Loader2, Chrome } from "lucide-react";

const SignInDialog = ({ openDialog, closeDialog }) => {
  const { setUserDetail } = React.useContext(UserDetailContext);
  const CreateUser = useAction(api.users.CreateUser);
  const LoginWithUsername = useAction(api.users.LoginWithUsername);

  const [tab, setTab] = useState("google");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Default user image path
  const DEFAULT_USER_IMAGE = "/user.jpg";

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const user = userInfo.data;

        const createdUser = await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture || DEFAULT_USER_IMAGE,
          uid: uuidv4(),
          authMethod: "google",
        });

        const userWithId = {
          ...user,
          picture: user?.picture || DEFAULT_USER_IMAGE,
          _id: createdUser,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userWithId));
        }

        setUserDetail(userWithId);
        closeDialog(false);
      } catch (err) {
        setError(err.message || "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      setError("Google sign-in failed");
      console.log(errorResponse);
    },
  });

  const handleUsernameSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      // Generate a unique email using username
      const generatedEmail = `${username}@astra-local.app`;

      const createdUser = await CreateUser({
        name,
        email: generatedEmail,
        username,
        picture: DEFAULT_USER_IMAGE,
        uid: uuidv4(),
        password,
        authMethod: "username",
      });

      const userWithId = {
        name,
        email: generatedEmail,
        username,
        picture: DEFAULT_USER_IMAGE,
        _id: createdUser,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithId));
      }

      setUserDetail(userWithId);
      closeDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const user = await LoginWithUsername({ username, password });

      // Ensure picture has a default value
      const userWithPicture = {
        ...user,
        picture: user.picture || DEFAULT_USER_IMAGE,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithPicture));
      }

      setUserDetail(userWithPicture);
      closeDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md bg-black border border-gray-800 p-0 overflow-hidden">
        <div className="relative bg-black">
          <DialogHeader className="relative z-10 p-6 pb-4 border-b border-gray-800">
            <DialogTitle className="text-center">
              <h2 className="font-bold text-2xl text-white">
                Welcome to Astra AI
              </h2>
            </DialogTitle>
            <DialogDescription>
              <p className="mt-2 text-center text-gray-400 text-sm">
                Create amazing apps with AI assistance
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 p-6">
            {/* Tab Selection */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setTab("google")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  tab === "google"
                    ? "bg-black text-white border-2 border-blue-500"
                    : "bg-black text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Google
                </div>
              </button>
              <button
                onClick={() => setTab("username")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  tab === "username"
                    ? "bg-black text-white border-2 border-purple-500"
                    : "bg-black text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </div>
              </button>
            </div>

            {/* Google Tab */}
            {tab === "google" && (
              <div className="space-y-4">
                <Button
                  onClick={() => googleLogin()}
                  disabled={loading}
                  className="w-full h-11 bg-black hover:bg-gray-950 text-white border-2 border-blue-500 hover:border-blue-400 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Chrome className="h-5 w-5" />
                      Sign In With Google
                    </div>
                  )}
                </Button>
              </div>
            )}

            {/* Username Tab */}
            {tab === "username" && (
              <div className="space-y-4">
                {/* Sign Up / Log In Toggle */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isSignUp
                        ? "bg-black text-white border border-purple-500"
                        : "bg-black text-gray-400 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      !isSignUp
                        ? "bg-black text-white border border-purple-500"
                        : "bg-black text-gray-400 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    Log In
                  </button>
                </div>

                <form
                  onSubmit={
                    isSignUp ? handleUsernameSignUp : handleUsernameSignIn
                  }
                  className="space-y-3"
                >
                  {isSignUp && (
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        disabled={loading}
                      />
                    </div>
                  )}
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      disabled={loading}
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-black border border-red-500 rounded-lg p-3">
                      <p className="text-red-400 text-sm text-center">
                        {error}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-black hover:bg-gray-950 text-white border-2 border-purple-500 hover:border-purple-400 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 mt-4"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isSignUp ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </div>
            )}

            <p className="text-xs text-center mt-6 text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
