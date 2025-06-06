"use client";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default function MyProfilePage() {
  const { user, error, isLoading } = useUser();

  console.log("User data:", user);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>You are not logged in.</div>;

  return (
    <div style={{ marginTop: "140px", color: "white" }}>
      <h1>My Profile</h1>
      <p>Name: {user.nickname}</p>
      <p>Email: {user.name}</p>
    <Image
        src={user.picture}
        alt={user.name || "Profile Picture"}
        width={45}
        height={45}
    />
    </div>
  );
}
