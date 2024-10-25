import { create } from "zustand";

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
  addToCart: (item: CartItem) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.variant.variantId === item.variant.variantId
      );
      if (existingItem) {
        const updatedCart = state.cart.map((cartItem) => {
          if (cartItem.variant.variantId === item.variant.variantId) {
            return {
              ...cartItem,
              variant: {
                ...cartItem.variant,
                quantity: cartItem.variant.quantity + item.variant.quantity,
              },
            };
          }
          return cartItem;
        });
        return { cart: updatedCart };
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
        };
      }
    }),
}));
