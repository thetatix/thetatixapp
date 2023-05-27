import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@/assets/styles/Pages.module.css'
import styleForms from '@/assets/styles/Forms.module.css'
import styleSearch from '@/assets/styles/Search.module.css'


export default function Search() {
    return (
        <>
            <Head>
                <title>Thetatix Seacrh Events</title>
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerContainer + ' container'}>
                        <div className={styles.content}>
                            <h1>Search</h1>
                            <input type="search" />
                        </div>
                    </div>
                </header>
                <section className={styles.section}>
                    <div className={styles.sectionContainer + ' container'}>
                        <div className={styles.content}>
                            Aqui van las event cards que se obtienen
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
