"use client";
import { User } from "next-auth";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  LogOutIcon,
  Moon,
  Settings,
  Sun,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Suspense, useState } from "react";
import Image from "next/image";
import { ThemeSwitcher } from "../theme-switcher";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
}

const AuthButton = ({ user }: Props) => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);

  const setSwitchState = () => {
    switch (theme) {
      case "dark":
        return setChecked(true);
      case "light":
        return setChecked(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.image ?? ""} alt="@shadcn" />
                <AvatarFallback>
                  <span className="text-amber-400 font-semibold">
                    {user.name?.slice(0, 2).toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2" align="end">
              {/* avatar */}
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

              {/* orders */}
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/orders")}
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
              >
                <TruckIcon className="mr-2 w-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                <span className="">My Orders</span>
              </DropdownMenuItem>

              {/* settings */}
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
              >
                <Settings className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
                <span className="">Settings</span>
              </DropdownMenuItem>

              {/* theme switch */}
              <DropdownMenuItem
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                <ThemeSwitcher />
              </DropdownMenuItem>

              {/* logout */}
              <DropdownMenuItem
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
                onClick={() => signOut()}
              >
                <LogOutIcon className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
                <span>Logout</span>
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
