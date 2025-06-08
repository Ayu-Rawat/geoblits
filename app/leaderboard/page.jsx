"use client";

import React,{useState,useEffect} from "react";
import Footer from "@/components/footer/footer";

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function fetchLeaderboard() {
        try {
            const response = await fetch("/api/user/leader-board");
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
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
    
    if (loading) return <div style={{ marginTop: "140px", color: "white" }}>Loading...</div>;

    if (leaderboard.length === 0) {
        return <div style={{ marginTop: "140px", color: "white" }}>No leaderboard data available.</div>;
    }
    
    return (
        <div style={{ marginTop: "140px", color: "white" }}>
        <h1>Leaderboard</h1>
        <ul>
            {leaderboard.map((entry, index) => (
            <li key={index}>
                {entry.nickname}: {entry.score}
            </li>
            ))}
        </ul>
        <Footer />
        </div>
    );
}

export default LeaderboardPage;