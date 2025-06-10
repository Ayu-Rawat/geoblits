"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/footer/footer";
import Image from "next/image";
import styles from "./leaderboard.module.css";

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/user/leader-board");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setLeaderboard(data.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div style={{ marginTop: "140px", color: "white", textAlign: "center" }}>
        Loading...
      </div>
    );

  if (leaderboard.length === 0) {
    return (
      <div style={{ marginTop: "140px", color: "white", textAlign: "center" }}>
        No leaderboard data available.
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <h1 className={styles.title}>Leaderboard</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                    <span style={{
                        padding: "10px",
                        backgroundColor: "#5f2dfe",
                        borderRadius: "10px",
                        margin: "10px",
                        border: "1px solid #ff7dec",
                    }}>Rank
                    </span>
                </th>
                <th>
                    <span style={{
                        padding: "10px",
                        backgroundColor: "#5f2dfe",
                        borderRadius: "10px",
                        margin: "10px",
                        border: "1px solid #ff7dec",
                    }}>User
                    </span>
                </th>
                <th>
                    <span style={{
                        padding: "10px",
                        backgroundColor: "#5f2dfe",
                        borderRadius: "10px",
                        margin: "10px",
                        border: "1px solid #ff7dec",
                    }}>Score
                    </span>
                </th>
              </tr>
            </thead>
<tbody>
  {leaderboard.map((entry, index) => {
    if (index === 0) index = "👑";
    else if (index === 1) index = "🥈";
    else if (index === 2) index = "🥉";
    else index+=1;

    return (
      <tr key={index}>
        <td style={{ color: "white" }}>
          <span style={{position:"relative",left:"26px"}}>{index}</span>
        </td>
        <td>
          <div className={styles.userCell}>
            <div className={styles.profileImage}>
              <Image
                src={entry.image_url}
                alt={`${entry.nickname} blurred`}
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  overflow: "hidden",
                  borderRadius: "0px",
                  filter: "blur(15px)",
                }}
                className={styles.blurredImage}
              />
              <Image
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
                src={entry.image_url}
                alt={`${entry.nickname} avatar`}
                fill
                className={styles.clearImage}
              />
            </div>
            <span style={{ color: "white" }}>{entry.nickname}</span>
          </div>
        </td>
        <td style={{ color: "white"}}>
            <span style={{position:"relative",left:"32px"}}>{entry.score}</span>
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
