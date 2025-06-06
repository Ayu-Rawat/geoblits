"use client"

import React from 'react';
import styles from './style.module.css';

export default function SingleInput({
  holder,
  type = "text",
  width,
  value,
  onChange,
  name,
  ...props
}) {
  const handleChange = (e) => {
    if (type === "number") {
      const newValue = e.target.value;
      if (!/^\d*$/.test(newValue)) return;
    }

    onChange?.(e);
  };

  return (
    <div
      className={styles.border}
      style={{
        width: width ? `unset` : "100%",
        height: type === "date" || type === "datetime-local" ? "auto" : "38px",
      }}
    >
      <input
        className={styles.text}
        placeholder={type !== "date" && type !== "datetime-local" ? holder : ""}
        onChange={handleChange}
        value={value}
        type={type}
        name={name}
        {...props}
        style={{
          width: width ? `${width}px` : '100%',
          height: type === "date" || type === "datetime-local" ? "40px" : "38px",
        }}
      />
      <div className={styles.outline}></div>
    </div>
  );
}
