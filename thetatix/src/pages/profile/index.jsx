import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Head from 'next/head'

import styles from '@/assets/styles/Pages.module.css'

export default function Profile() {
  const { address, isConnected } =  useContext(DataContext);
  return (
    <>
        <Head>
            <title>Profile</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className="col-12">
                            <h1>Profile</h1>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styles.content}>
                        <p>profile</p>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
