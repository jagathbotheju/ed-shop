"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";
import { User } from "@/server/db/schema/user";

interface Props {
  user: User;
}

const DashboardNav = ({ user }: Props) => {
  const pathname = usePathname();
  const userLinks = [
    { label: "Orders", path: "/dashboard/orders", icon: <Truck size={22} /> },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={22} />,
    },
  ] as const;

  const adminLinks =
    user?.role === "admin"
      ? ([
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={22} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={22} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={22} />,
          },
        ] as const)
      : [];

  const links = [...adminLinks, ...userLinks];

  return (
    <nav className="py-6 overflow-auto">
      <ul className="flex gap-6 font-semibold text-xs">
        <AnimatePresence>
          {links.map((link) => (
            <motion.li key={link.path} whileTap={{ scale: 0.95 }}>
              <Link
                href={link.path}
                className={cn(
                  "flex flex-col items-center gap-1 relative",
                  pathname === link.path ? "text-primary" : ""
                )}
              >
                {link.icon}
                <p>{link.label}</p>
                {pathname === link.path ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-2"
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
};
export default DashboardNav;
