"use client";

import React from "react";
import styles from "./badges.module.css";

export default function Badge({
    text,
    varient,
    width 
}) {
    return (
        <div
            className={`${styles.badgeContainer} ${styles[varient]}`}
            style={{
                width: width ? `${width}px` : "max-content",
            }}
        >
            <span>{text}</span>
        </div>
    );
}