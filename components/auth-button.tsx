"use client";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn, LogOut, UserPen } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  user: User;
}

const AuthButton = ({ user }: Props) => {
  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span>{user.email}</span>
          <Button size="sm" onClick={() => signOut()}>
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
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
