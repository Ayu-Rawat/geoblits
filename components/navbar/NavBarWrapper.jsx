"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./navbar";
import { useUser } from "@auth0/nextjs-auth0";

const links = [
  { href: "/myprofile", text: "Profile" },
  { href: "/quiz", text: "Quiz" },
  { href: "/leaderboard", text: "Leaderboard" },
];

export default function NavBarWrapper() {
  const { user, isLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      const isLoggedIn = !!user;
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn && user?.picture) {
        fetch("/api/user/store-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ picture: user.picture }),
        }).catch((err) => {
          console.error("Error storing user in DB:", err);
        });
      }
    }
  }, [user, isLoading]);

  if (isLoading || isAuthenticated === null) return null;

  return <NavBar links={links} loggedIn={isAuthenticated} />;
}
