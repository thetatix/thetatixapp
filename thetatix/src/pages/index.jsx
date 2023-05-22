import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { DataContext } from '@/context/DataContext'
import { useContext, useEffect, useState } from "react";

import styles from '@/assets/styles/Home.module.css'
// import { getAllUsers } from '@/server/users'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { isLightMode, setIsLightMode } = useContext(DataContext);

  const handleLightModeToggle = () => {
    setIsLightMode(!isLightMode);
  }

  const bodyStyles = {
    backgroundColor: isLightMode ? 'red' : 'initial'
  };

  return (
    <>
      <Head>
        <title>Thetatix</title>
        <meta name="description" content="Thetatix web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${isLightMode ? styles.light: ''}`}>
        <header className={styles.header}>
          <div className={styles.headerContainer + ' container'}>
            <div className={styles.content + ' row'}>
              <div className={styles.column + ' col'}>
                <p className={styles.title}>The Web3 <br></br> ticketing and <br></br> events platform</p>
                <div className={styles.subtitleContainer}>
                  <p className={styles.subtitle}>Powered by Theta Network</p>
                  <Image
                    src="/icons/full-theta-icon.svg"
                    alt="Theta icon"
                    width={34}
                    height={34}
                  />
                </div>
                
                
                {/* <div className={styles.squareLeft}></div> */}
              </div>
              <div className={styles.column + ' col'}>
                <Link href="/" className={styles.eventCard}>
                  <div className={styles.event}>
                    <div className={styles.eventImg}>
                      <Image
                        src="/img/event-afterlife.png"
                        alt="Event image"
                        width={2400}
                        height={1600}
                        priority
                      />
                    </div>
                    <p>
                      <strong>Afterlife</strong>
                      <br />
                      Monday, 10:00 A.M.
                      <br />
                      Mexico City
                    </p>
                  </div>
                </Link>
                {/* <div className={styles.squareRight}></div> */}
                {/* <div className={styles.blurRight}></div> */}
                <img className={styles.blurRight} src="img/right-blur.png" alt="" />
              </div>
            </div>
          </div>
        </header>
        <section className={styles.section}></section>
        
        
      </main>
    </>
  );
}

// export async function getServerSideProps() {
//   const users = await getAllUsers();
//   return { props: { users } };
// }
