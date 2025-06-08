import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";

export default function Footer() {
    return (
        <div className={styles.footerContainer}>
            <h3 className={styles.footerHead}>
                GEOBLITZ
            </h3>
            <div className={styles.footerContent}>
                <div className={styles.grid}>
                    <div className={styles.gridCon}>
                        <h4 style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "16px",
                            fontWeight: "300",
                        }}>
                            Links
                        </h4>
                        <Link className={styles.link} href={"/quiz"}>
                            Quiz
                        </Link>
                        <Link className={styles.link} href={"/leaderboard"}>
                            Leader Board
                        </Link>
                    </div>
                    <div className={styles.gridCon}>
                        <h4 style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "16px",
                            fontWeight: "300",
                        }}>
                            This Project
                        </h4>
                        <a className={styles.link} href={"mailto:jeepedia.in@gmail.com"} target={"_blank"}>
                            Mail
                        </a>
                        <a className={styles.link} href={"https://github.com/Ayu-Rawat/quiz-app"} target={"_blank"}>
                            GitHub
                        </a>
                    </div>
                    <div className={styles.gridCon}>
                        <h4 style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: '"Roboto", sans-serif',

                            fontSize: "16px",
                            fontWeight: "200",
                        }}>
                            <span>My Social Links</span>
                        </h4>
                        <a className={styles.link} href={"https://www.linkedin.com/in/ayush-rawat-480537307/"}>
                            Linkedin
                        </a>
                        <a className={styles.link} href={"https://www.instagram.com/__ayush5506__/"}>
                            Instagram
                        </a>
                        <a className={styles.link} href={"https://github.com/Ayu-Rawat"}>
                            Github
                        </a>
                    </div>
                </div>
                <div className={styles.lowerCon}>
                    <p style={{
                        margin: "0",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "12px",
                        textAlign: "right",
                        fontWeight: "300",
                        color: "rgba(255,255,255,0.65)",
                    }}>
                        Made For Fun.
                    </p>
                    <div style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        margin: "0",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        <Image style={{
                            objectFit: "contain",
                            borderRadius: "5px",
                            filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
                        }} src="https://res.cloudinary.com/dqvwf3z2c/image/upload/v1749278510/cnpksweg6naobvwjyyy2.gif" alt={"App Icon"} fill={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}