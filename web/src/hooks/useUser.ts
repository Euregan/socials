import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  email: string;
  admin: boolean;
};

type UserState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const userStore = createStore<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      // TODO: Clean the cookie
      logout: () => set({ user: null }),
    }),
    { name: "user" },
  ),
);

export const useUser = () => useStore(userStore);
