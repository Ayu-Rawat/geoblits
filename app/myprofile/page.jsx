"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import Footer from "@/components/footer/footer";
import Styles from "./myprofile.module.css";

export default function MyProfilePage() {
  const { user, error } = useUser();
  const [userData, setUserData] = useState(null);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserDataAndScore = async () => {
      try {
        const userRes = await fetch("/api/user/get-user", {
          method: "POST",
          body: JSON.stringify({ userId: user.sub }),
          headers: { "Content-Type": "application/json" },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUserData(userData.user);

        const scoreRes = await fetch("/api/user/get-score", {
          method: "POST",
          body: JSON.stringify({ userId: user.sub }),
          headers: { "Content-Type": "application/json" },
        });

        if (!scoreRes.ok) throw new Error("Failed to fetch score");
        const scoreData = await scoreRes.json();
        setScore(scoreData.score);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndScore();
  }, [user]);

  if (!user && !isLoading) return <div>You are not logged in.</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading || !userData) return <div>Loading...</div>;

  console.log("user score:", score);

  return (
    <>
      <div className={Styles.profileContainer} style={{ marginTop: "140px", color: "white" }}>
        <p>Name: {userData[0].nickname}</p>
        <p>Email: {userData[0].email}</p>
        <p>Score: {score !== null ? score : "Not available"}</p>
        <Image
          src={userData[0].image_url}
          alt={userData[0].nickname || "Profile Picture"}
          width={45}
          height={45}
        />
      </div>
      <Footer />
    </>
  );
}
