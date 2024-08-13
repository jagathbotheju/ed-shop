import { auth } from "@/auth";
import AuthButton from "../auth-button";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <header className="container mx-auto max-w-7xl py-4">
      <nav>
        <ul className="flex justify-between items-center">
          <li className="flex gap-2 items-center">
            <Link href="/" className="relative">
              <Image
                alt="logo"
                src="/images/shop.svg"
                className="top-0 left-0 relative"
                width={40}
                height={40}
              />
            </Link>
            <h1 className="text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
              My Shop
            </h1>
          </li>
          <li>
            <AuthButton user={user} />
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Navbar;
