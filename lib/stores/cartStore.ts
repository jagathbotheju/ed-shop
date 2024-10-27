import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Variant = {
  variantId: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  totalQuantity: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      totalQuantity: 0,

      addToCart: (item) =>
        set((state) => {
          console.log(item);
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantId === item.variant.variantId
          );
          let totalQuantity = state.totalQuantity;
          if (state.totalQuantity > 0) totalQuantity += state.totalQuantity;
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantId === item.variant.variantId) {
                const quantity =
                  cartItem.variant.quantity + item.variant.quantity;
                totalQuantity++;
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity,
                  },
                };
              }
              return cartItem;
            });

            return { cart: updatedCart, totalQuantity };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantId: item.variant.variantId,
                    quantity: item.variant.quantity,
                  },
                },
              ],
              totalQuantity,
            };
          }
        }),
      removeFromCart: (item) => {
        set((state) => {
          let totalQuantity = state.totalQuantity;
          console.log("existing quantity before update", totalQuantity);

          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantId === item.variant.variantId) {
              const quantity =
                cartItem.variant.quantity - item.variant.quantity;
              totalQuantity--;
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity,
                },
              };
            }
            return cartItem;
          });
          // console.log("existing quantity after update", totalQuantity);
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
            totalQuantity,
          };
        });
      },
    }),
    { name: "cart-storage" }
  )
);
