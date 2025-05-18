"use client";

import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  user: null,
  setUser: () => null,
  getUser: () => null,
  removeUser: () => {},
};

const AuthProviderContext = createContext(initialState);

export function AuthProvider({
  children,
  userStorageKey = "profile_pulse_user",
  user: initialUser,
}) {
  const [user, setUser] = useState(null);

  // Track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Initialize user state from localStorage after mounting
  useEffect(() => {
    setIsMounted(true); // Mark component as mounted
    const storedUser = localStorage.getItem(userStorageKey);
    setUser(storedUser ? JSON.parse(storedUser) : initialUser || null);
  }, [initialUser, userStorageKey]);

  // Update localStorage when user changes
  useEffect(() => {
    if (isMounted) {
      if (user) {
        localStorage.setItem(userStorageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(userStorageKey);
      }
    }
  }, [user, userStorageKey, isMounted]);

  const getUser = () => user;

  const handleUser = (newUser) => {
    setUser(newUser);
  };

  const removeUser = () => {
    setUser(null);
  };

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AuthProviderContext.Provider
      value={{
        user,
        getUser,
        setUser: handleUser,
        removeUser,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
