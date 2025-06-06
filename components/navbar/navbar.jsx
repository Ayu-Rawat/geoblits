"use client"
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

export default function NavBar({links, loggedIn}) {
    const path = usePathname()
    const [isOpen, setIsOpen] = useState(false);
    function checkUrl(url) {
        return path.startsWith(url)
    }
    useEffect(() => {
        setIsOpen(false)
    }, [path])

    return (<>
            <div className={styles.navBar}>
                <Link href={"/"} className={styles.leftBox}>
                    <Image src="/icons/navbar/logo.gif" alt={"Logo"} width={40} height={40} style={{
                        borderRadius: "8px",
                    }}/>
                </Link>
                <div className={styles.centerBox}>
                    {links.map((link) => (
                        <Link key={link.href} className={checkUrl(link.href) ? `${styles.link} ${styles.active}` : styles.link}
                              href={link.href}>{link.text}</Link>
                    ))}
                </div>
                {!loggedIn ? <a style={{
                    width: "100px",
                    color: "white",
                }} href="/myprofile" className={styles.rightBox}>
                    Sign In
                </a> : <a style={{
                    backgroundColor: "rgba(255,153,153,0.24)",
                    border: "1px solid rgba(255,153,153,0.24)",
                    width: "100px",
                    color: "white",
                }} href="/auth/logout"  className={styles.rightBox}>Sign Out</a>}

                <div onClick={() => {
                    setIsOpen((v) => !v)
                }} className={`${styles.mob} ${styles.rightBox} ${isOpen ? styles.menuActive : ""}`}>
                    <Image className={styles.menuIcon} src="/icons/navbar/menu.svg" alt={"Men Icon"} width={18} height={18}/>
                    <Image className={styles.crossIcon} src="/icons/navbar/cross.svg" alt={"Cross Icon"} width={18} height={18}/>
                </div>
                <div className={isOpen ? `${styles.mobileLinkBox} ${styles.activeMd}` : `${styles.mobileLinkBox}`}>
                    <Image className={styles.crossIcon} src="/icons/navbar/cross.svg" alt={"Cross Icon"} width={18} height={18}/>
                </div>
                <div className={isOpen ? `${styles.mobileLinkBox} ${styles.activeMd}` : `${styles.mobileLinkBox}`}>
                    <div className={styles.linkList}>
                        {links.map((link) => (
                            <Link key={link.href} className={checkUrl(link.href) ? `${styles.link} ${styles.active}` : styles.link}
                                  href={link.href}>{link.text}</Link>
                        ))}
                    </div>
                    {!loggedIn ? <a href="/myprofile" className={styles.homeIcon}>
                        Sign In
                    </a> : <a style={{
                        backgroundColor: "rgba(255,153,153,0.24)",
                        border: "1px solid rgba(255,153,153,0.24)",
                    }} href="/auth/logout"  className={styles.homeIcon}>Sign Out</a>}

                </div>
            </div>
            <div onClick={() => setIsOpen((v) => !v)}
                 className={isOpen ? `${styles.mobileBg} ${styles.open}` : styles.mobileBg}>

            </div>
        </>
    )
}