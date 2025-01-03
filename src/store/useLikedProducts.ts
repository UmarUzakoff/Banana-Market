import { create } from "zustand";

interface LikedProduct {
  _id: string;
  name: string;
  category: { name: string };
  image: string;
  price: number;
  color: string;
  quantity: number;
}

interface Store {
  likedProducts: LikedProduct[];
  addLikedProduct: (product: LikedProduct) => void;
  removeLikedProduct: (productId: string) => void;
  clearLikedProducts: () => void;
}

export const useLikedProductsStore = create<Store>((set) => ({
  likedProducts: JSON.parse(localStorage.getItem("likedProducts") || "[]"),
  addLikedProduct: (product) => {
    set((state) => {
      const newLikedProducts = [...state.likedProducts, product];
      localStorage.setItem("likedProducts", JSON.stringify(newLikedProducts));
      return { likedProducts: newLikedProducts };
    });
  },
  removeLikedProduct: (productId) => {
    set((state) => {
      const newLikedProducts = state.likedProducts.filter(
        (product) => product._id !== productId
      );
      localStorage.setItem("likedProducts", JSON.stringify(newLikedProducts));
      return { likedProducts: newLikedProducts };
    });
  },
  clearLikedProducts: () => {
    localStorage.removeItem("likedProducts");
    set({ likedProducts: [] });
  },
}));
