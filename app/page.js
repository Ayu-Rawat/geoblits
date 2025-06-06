import Image from "next/image";
import styles from "./page.module.css";
// import counsellingBg from "@/public/backgrounds/counsellings/bg1.png"
// import predictor from "@/public/backgrounds/tools/predictor.png"
// import uni from "@/public/backgrounds/tools/uni.png"
// import placements from "@/public/backgrounds/tools/placements.png"
import Link from "next/link";
import {SiGithub} from "react-icons/si";
import {MdMail} from "react-icons/md";
import Footer from "@/components/footer/footer.jsx";

export default function Home() {
    return (
    <article className={styles.page}>
        <Image src="/backgrounds/bg.png" alt={"Background"} fill={true} style={{
            objectFit: "cover",
            objectPosition: "right",
        }} className={styles.desktop} quality={100}/>
        <Image src="/backgrounds/bg-m.png" alt={"Background"} fill={true} style={{
            objectFit: "cover",
        }} className={styles.mobile} quality={100}/>
        <main className={styles.content}>
            <div className={styles.contentContainer}>
                <h1 className={styles.header}>
                    <span className={styles.animation}>
                        GeoBlits
                    </span>
                    <br />
                </h1>
                <p className={styles.lower}>
                    Your Geography Challenge Awaits
                </p>
                <Link href={"/quiz"} className={styles.link}>
                    <p className={styles.text}>
                        Play Now
                    </p>
                    <div className={styles.linkImage}>
                      <Image src="/icons/home/arrow.svg" alt={"Arrow"} width={30} height={30} />
                    </div>
                </Link>
            </div>
        </main>
        <section className={styles.extraContent}>
            <div className={styles.sepLine}>

            </div>
            {/* <h2 className={styles.toolHeader}>
                The Only Tool<br/>You Need
            </h2>
            <div className={styles.toolContainer}>
                <div className={styles.leftContainer}>

                    <Image style={{
                        objectFit: "cover",
                        objectPosition: "left",
                    }} src={predictor} alt={"Predictor"} fill={true}/>
                    <h3 style={{
                        top: "10px",
                        left: "10px",
                    }} className={styles.toolName}>
                        Predictor
                    </h3>

                </div>
                <div className={styles.rightContainer}>

                    <div className={styles.topTool }>
                        <Image style={{
                            objectFit: "cover",
                            objectPosition: "bottom right",
                        }} src={placements} alt={"Predictor"} fill={true}/>
                        <h3 style={{
                            bottom: "10px",
                            right: "10px",
                        }} className={styles.toolName1}>
                            Placements
                        </h3>
                    </div>
                    <div className={styles.topTool}>
                        <Image style={{
                            objectFit: "cover",
                            objectPosition: "top",
                        }} src={uni} alt={"Universities"} fill={true}/>
                        <h3 style={{
                            top: "10px",
                            right:  "10px",
                        }} className={styles.toolName}>
                            Universities
                        </h3>
                    </div>
                </div>
            </div>
            <div className={styles.conContainer}>
                <div className={styles.heading}>
                    <h3 style={{
                        fontFamily: "Roboto",
                        color: "rgba(255,255,255,0.66)",
                        fontWeight: "900",
                        fontSize: "38px",
                    }}>
                        Counsellings
                    </h3>
                    <Image src={counsellingBg} alt={"Counselling Background"} fill={true} style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        overflow: "hidden",
                        zIndex: "-1"
                    }}/>
                </div>
                <div className={styles.counsellingGrid}>
                    {
                        counsellings.map((counselling) => (
                            <div key={counselling.name} className={styles.counselling}>
                                <div className={styles.icons}>
                                    <Image style={{
                                        objectFit: "contain",
                                        objectPosition: "center",
                                        overflow: "hidden"
                                    }} src={counselling.icon} alt={counselling.name} fill={true}/>
                                </div>

                                <div>
                                    <h5 style={{
                                        fontSize: 24,
                                        fontWeight: 800,
                                        margin: "0",

                                        color: "#ffffff",
                                    }}>
                                        {counselling.name}
                                    </h5>
                                    <p style={{
                                        fontSize: 16,
                                        fontWeight: 300,
                                        margin: "0",
                                        color: "rgba(255,255,255,0.64)",
                                    }}>
                                        {counselling.description}
                                    </p>
                                </div>
                            </div>
                        )).reverse()
                    }
                </div> */}
            {/* </div> */}
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
                        <a style={{
                            color: "#ffffff",
                        }} className={styles.linkOut} target="_blank" href="https://github.com/Ayu-Rawat">
                            <SiGithub/> GitHub
                        </a>
                    </div>

                </div>
                <div className={styles.rightC}>
                    About<br/>
                    This Project
                </div>
            </div>
            <div className={styles.contactHead}>
                <Image src="/backgrounds/tools/contact.png" alt={"contact"} fill={true} style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    zIndex: "1"
                }} />
                <div className={styles.contactText}>
                    <h2 className={styles.head1}>
                        But Maybe You've<br />Still Got Questions
                    </h2>
                    <a href="mailto:jeepedia.in@gmail.com" className={styles.contactLink}>
                        <MdMail /> Mail Us
                    </a>
                </div>

            </div>
            <Footer />

        </section>

    </article>

    );
}
