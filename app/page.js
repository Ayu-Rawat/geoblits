import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import Footer from "@/components/footer/footer.jsx";

export default function Home() {
    return (
    <article className={styles.page}>
        <Image src="https://res.cloudinary.com/dqvwf3z2c/image/upload/v1749413279/my-bg_epnief.png" alt={"Background"} fill={true} style={{
            objectFit: "cover",
            objectPosition: "right",
        }} className={styles.desktop} quality={100}/>
        <Image src="https://res.cloudinary.com/dqvwf3z2c/image/upload/v1749413280/my-bg-m_pwqnf4.png" alt={"Background"} fill={true} style={{
            objectFit: "cover",
        }} className={styles.mobile} quality={100}/>
        <main className={styles.content}>
            <p className={styles.lower}>
                Your Geography<br/> Challenge Awaits
            </p>
            <div className={styles.contentContainer}>
                <Link href={"/quiz"} className={styles.link}>
                    <p className={styles.text}>
                        Play Now
                    </p>
                    <div className={styles.linkImage}>
                        <Image src="https://res.cloudinary.com/dqvwf3z2c/image/upload/v1749441094/my-arrow-v2_j4xz6n.png" alt={"Arrow"} width={40} height={40} />
                    </div>
                </Link>
            </div>
        </main>
        <section className={styles.extraContent}>
            <div className={styles.aboutTop}>
                <div className={styles.leftC}>
                    <p> <b>GeoBlits</b> is a fun and engaging game where you have to guess the highlighted country on the map. The game includes a leaderboard system to track your progress and compare scores with others! </p> <p> I created this website as a way to apply my learning of Auth0, and it's all about having fun while testing your geography skills. </p> <p> Contributions, feedback, and ideas for improvement are always welcome! </p>
                    <div style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 16,
                    }}>
                        <a
                            className={styles.linkOut}
                            target="_blank"
                            href="https://www.instagram.com/jeepedia.in/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <svg width="0" height="0">
                                <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                                    <stop stopColor="#f9ce34" offset="0%"/>
                                    <stop stopColor="#ee2a7b" offset="50%"/>
                                    <stop stopColor="#6228d7" offset="100%"/>
                                </linearGradient>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className={styles.rightC}>
                    About This<br/> shitty App
                </div>
        </div>
            <div className={styles.patternContainer}>
                <div className={styles.pattern}>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                </div>
            </div>
            <div className={styles.aboutBottom}>
                <a href="https://github.com/Ayu-Rawat/quiz-app" className={styles.ctaLink}>
                    <span>Star this project</span>
                    <span className={styles.ctaArrow}>↗</span>
                </a>
            </div>
            <Footer />

        </section>

    </article>

    );
}
