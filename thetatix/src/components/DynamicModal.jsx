// import { useContext, useEffect, useState } from "react";
// import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
// import Link from 'next/link'
import styles from '@/assets/styles/Modal.module.css'

// status solo puede ser: "success", "danger", "loading"
// message es el mensaje que aparece
// closable: true o false; significa si se puede cerrar la alerta
export default function DynamicModal({active, status, message, closeable}) {
  if (!active) {
    return null;
  }
  return (
    <>
        <div className={styles.darken}></div>
        <div className={styles.modal}>
          <div className={styles.modalContainer + ' container'}>
            <div className={styles.content}>
              <div className={styles.closeBtn}>
                <button>
                  X
                </button>
              </div>
              <div className={styles.img}></div>
              <div className={styles.text}>
                <p>
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
