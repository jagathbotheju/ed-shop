"use client";
import { useCartStore } from "@/lib/stores/cartStore";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import emptyCart from "@/public/empty-cart.json";
import { createId } from "@paralleldrive/cuid2";

const CartItems = () => {
  const { cart, addToCart, removeFromCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.price * item.variant.quantity,
      0
    );
  }, [cart]);

  const totalPriceInLetters = useMemo(() => {
    return [...formatCurrency(totalPrice)].map((letter) => {
      return {
        letter,
        id: createId(),
      };
    });
  }, [totalPrice]);

  return (
    <motion.div>
      {cart.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your card is empty
            </h2>
            <Lottie className="h-64" animationData={emptyCart} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item, index) => (
                <TableRow key={item.id + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        src={item.image}
                        width={48}
                        height={48}
                        alt={item.name}
                        className="rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between gap-2">
                      <MinusCircle
                        onClick={() =>
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          })
                        }
                        size={16}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-all"
                      />
                      <p className="text-lg font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-all"
                        onClick={() =>
                          addToCart({
                            ...item,
                            variant: {
                              variantId: item.variant.variantId,
                              quantity: 1,
                            },
                          })
                        }
                        size={16}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <motion.div className="flex items-center justify-center overflow-hidden relative my-4">
        <span className="text-lg font-bold">Total : </span>
        <AnimatePresence mode="popLayout">
          {totalPriceInLetters.map((item, i) => (
            <motion.div key={item.id}>
              <motion.span
                className="text-md inline-block text-lg font-bold"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
export default CartItems;
