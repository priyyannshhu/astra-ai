"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import Link from "next/link";
import SignInDialog from "@/components/custom/SignInDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserDetail(null);
  };

  return (
    <>
      <div className="p-4 flex justify-between items-center">
        {/* Logo + Text */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.png" alt="Astra Logo" width={30} height={30} />
          <div className="flex flex-col">
            <span className="font-semibold">Astra</span>
            <span className="text-xs font-normal text-gray-400 -mt-1">
              formerly known as MERN AI
            </span>
          </div>
        </Link>

        {/* If user not logged in → show buttons */}
        {!userDetail?.name ? (
          <div className="flex gap-5">
            <Button variant="ghost" onClick={() => setOpenDialog(true)}>
              Sign In
            </Button>
            <Button
              className="text-white"
              style={{
                background: "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
              }}
              onClick={() => setOpenDialog(true)}
            >
              Get Started
            </Button>
          </div>
        ) : (
          /* If logged in → show profile dropdown */
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src={userDetail?.picture || "/default-avatar.png"}
                  alt={userDetail?.name}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <span className="font-xs">{userDetail?.name}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>{userDetail?.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* SignInDialog */}
      <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </>
  );
}

export default Header;
