"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import Footer from "@/components/footer/footer";
import Styles from "./myprofile.module.css";
import Dialog from "@/components/dialog-box/dialog-box";
import Button from "@/components/buttons/button";
import SingleInput from "@/components/Inputs/SingleInput/singleInput.jsx";

export default function MyProfilePage() {
  const [newNickname, setNewNickname] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  useEffect(() => {
  if (userData) {
    setNewNickname(userData[0].nickname);
  }
  }, [userData]);

  const handleSubmit = async () => {
    let base64Image = null;

    if (newImageFile) {
      const reader = new FileReader();
      base64Image = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(newImageFile);
      });
    }

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.sub,
          nickname: newNickname,
          imageUrl: base64Image,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setDialogOpen(false);
      // Re-fetch user data
      setIsLoading(true);
      setUserData(null); // force refresh
      setScore(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };


  if (!user && !isLoading) return <div>You are not logged in.</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading || !userData) return <div>Loading...</div>;

  console.log("user score:", score);

  return (
    <>
      <Dialog isOpen={dialogOpen}>
        <h1 style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "24px",
            fontWeight: "200",
            margin: "10px 5px",
            lineHeight: "24px",
            color: "white",
            marginBottom: "20px",
        }}>
            Edit Profile
        </h1>
        <div style={{
            marginTop: "20px",
            margin: "auto",
            width: "fit-content",
            display: "flex",
            justifyContent: "space-between",
            gap: "14px",
            marginBottom: "20px",
        }}>
          <span style={{color:"white",marginTop:"6px"}}>Nickname</span>
          <SingleInput
            holder={"Nickname"}
            type={"text"}
            width={200}
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}/>
        </div>
        <div style={{
            marginTop: "20px",
            margin: "auto",
            width: "fit-content",
            display: "flex",
            justifyContent: "space-between",
            gap: "14px",
        }}>
          <span style={{color:"white"}}>Upload New Image (optional)</span>
          <input
            style={{ width: "200px", color: "white" }}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setNewImageFile(file);
            }}
          />
        </div>
        <div style={{
            marginTop: "40px",
            marginLeft: "auto",
            width: "fit-content",
            display: "flex",
            justifyContent: "space-between",
            gap: "14px",
        }}>
            <Button text={"Submit"} onClick={handleSubmit} variant={"Secondary"} height={42} width={60}/>
            <Button text={"Close"} onClick={() => setDialogOpen(false)} variant={"Danger"} height={42} width={50}/>
        </div>
    </Dialog>
      <div className={Styles.page}>
        <h1 className={Styles.profileTitle}>
          My Profile
        </h1>
        <div className={Styles.profileContainer} style={{ color: "white" }}>
          <div className={Styles.profileImage}>
            <Image
              src={userData[0].image_url}
              alt={userData[0].nickname || "Profile Picture"}
              fill={true}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                overflow: "hidden",
                borderRadius: "10px",
                filter: "blur(10px)",
              }}
            />
            <Image
              src={userData[0].image_url}
              alt={userData[0].nickname || "Profile Picture"}
              fill={true}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                overflow: "hidden",
                borderRadius: "10px",
              }}
            />
          </div>
          <div className={Styles.profileInfo}>
            <div className={Styles.info}>
              <p>{userData[0].nickname}</p>
            </div>
            <div className={Styles.info}>
              <p>{userData[0].email}</p>
            </div>
            <div className={Styles.info}>
              <p>Score : {score !== null ? score : "Not available"}</p>
            </div>
            <button onClick={() => setDialogOpen(true)} className={Styles.editButton}>
              <span style={{color:"white"}}>Edit</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
