"use client";

import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  user: null,
  isLoading: true,
  setUser: () => null,
  getUser: () => null,
  removeUser: () => {},
  refreshUser: () => {},
};

const AuthProviderContext = createContext(initialState);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from server session
  const fetchUserFromSession = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/session");
      const data = await response.json();

      if (response.ok && data.authenticated) {
        setUser({
          id: data.userId,
          ...data.userData, // Include any additional user data from your session
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data on initial load
  useEffect(() => {
    fetchUserFromSession();
  }, []);

  const getUser = () => user;

  const handleUser = (newUser) => {
    setUser(newUser);
  };

  const removeUser = async () => {
    try {
      setIsLoading(true);
      // Call your logout endpoint to clear the server-side session
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = () => {
    return fetchUserFromSession();
  };

  return (
    <AuthProviderContext.Provider
      value={{
        user,
        isLoading,
        getUser,
        setUser: handleUser,
        removeUser,
        refreshUser,
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
