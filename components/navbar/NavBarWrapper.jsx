"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./navbar";

// auth0
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
      setIsAuthenticated(!!user); // true if user exists, false otherwise

      // Optionally store user in DB
      if (user) {
        fetch("/api/user/store-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({user}),
        }).catch((error) =>
          console.error("Error storing user:", error)
        );
      }
    }
  }, [user, isLoading]);

  if (isLoading || isAuthenticated === null) return null;

  return <NavBar links={links} loggedIn={isAuthenticated} />;
}
