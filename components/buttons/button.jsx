"use Client"

import React from 'react';
import styles from './button.module.css';
import Link from "next/link";

export default function Button({
  text,
  onClick,
  variant,
  width,
  disabled,
  height, to, newTab,
}) {
  return (
    <div 
      className={`${styles.buttonContainer} ${variant ? styles[variant] : ''}`}
      style={{ 
        width: width ? `${width}px` : '100%', 
        height: height ? `${height}px` : '35px'
      }}
    >
      {variant!="Link" ? <button
          onClick={onClick}
          disabled={disabled}
          className={`${styles.button} ${variant ? styles[variant] : ''}`}
      >
        <span style={{
          zIndex: "5"
        }}>
          {text}
        </span>
      </button> : <Link
          className={`${styles.button} ${variant ? styles[variant] : ''}`}
          href={to ? to : "/"} target={newTab ? "_blank" : ""}>
            {text}
      </Link>}
    </div>
  );
}
