"use client"

import React, { useEffect, useState } from 'react'
import styles from './dialog-box.module.css'

export default function Dialog({
  isOpen,
  children,
  onClose,
}) {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div className={`${styles.backdrop} ${isOpen ? styles.open : styles.closing}`} onClick={onClose}>
      <div
        className={`${styles.dialog} ${isOpen ? styles.open : styles.closing}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}
