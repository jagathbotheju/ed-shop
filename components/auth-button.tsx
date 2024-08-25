"use client";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  LogOutIcon,
  Settings,
  TruckIcon,
  UserPen,
} from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Suspense } from "react";
import Image from "next/image";
import { ThemeSwitcher } from "./theme-switcher";

interface Props {
  user: User;
}

const AuthButton = ({ user }: Props) => {
  // console.log(user);

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <Avatar>
                <AvatarImage src={user.image ?? ""} alt="@shadcn" />
                <AvatarFallback>
                  <span className="text-amber-600 font-semibold">
                    {user.name?.slice(0, 2).toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2" align="end">
              <div className="mb-2 p-2 flex flex-col gap-1 items-center bg-primary/25 rounded-lg">
                <Image
                  className="rounded-full"
                  src={user.image ? user.image : "/images/no-image.svg"}
                  alt="profile image"
                  width={36}
                  height={36}
                />
                <p className="font-bold text-xs">{user.name}</p>
                <span className="text-xs font-medium text-secondary-foreground">
                  {user.email}
                </span>
              </div>

              <DropdownMenuItem className="font-medium transition-all duration-500 cursor-pointer group">
                <TruckIcon className="mr-2 w-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                <span className="">My Orders</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="font-medium transition-all duration-500 cursor-pointer group">
                <Settings className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
                <span className="">Settings</span>
              </DropdownMenuItem>

              {/* theme switch */}
              <DropdownMenuItem className="font-medium transition-all duration-500 cursor-pointer group">
                <ThemeSwitcher />
                <span>Theme</span>
              </DropdownMenuItem>

              {/* logout */}
              <DropdownMenuItem
                className="font-medium transition-all duration-500 cursor-pointer group"
                onClick={() => signOut()}
              >
                <LogOutIcon className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
                <span className="">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button asChild size="sm">
            <Link href="/auth/login" className="flex items-center gap-1">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/register" className="flex items-center gap-1">
              <UserPen size={16} />
              <span>Register</span>
            </Link>
          </Button>
        </>
      )}
    </div>
  );
};
export default AuthButton;
