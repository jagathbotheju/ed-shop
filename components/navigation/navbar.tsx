import { User } from "@/server/db/schema/user";
import AuthButton from "../auth/auth-button";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import CartDrawer from "../cart/CartDrawer";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <header className="container mx-auto max-w-7xl py-8">
      <nav>
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/" className="relative flex gap-2 items-center">
              <Image
                alt="logo"
                src="/images/shop.svg"
                className="top-0 left-0 relative"
                width={40}
                height={40}
              />
              <h1 className="text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
                My Shop
              </h1>
            </Link>
          </li>
          <div className="flex items-center gap-4 md:gap-6">
            <li className="flex items-center relative hover:bg-muted">
              <CartDrawer />
            </li>
            <li>
              <AuthButton user={user} />
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};
export default Navbar;
