"use client";
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cartStore";
import CartItems from "./CartItems";

const CartDrawer = () => {
  const { cart, totalQuantity } = useCartStore();

  const totalQ = cart.reduce((acc, item) => acc + item.variant.quantity, 0);
  console.log("totalQuantity cal", totalQ);

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                exit={{ scale: 0 }}
                className="flex items-center justify-center absolute -top-1 -right-1 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {totalQ}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent
        aria-describedby="cart items"
        className="h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none"
      >
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>cart items...</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-auto p-4">
          <CartItems />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default CartDrawer;
