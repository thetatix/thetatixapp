import Head from 'next/head'
import Image from 'next/image'
import styles from '@/assets/styles/Home.module.css'

export default function Events() {
  return (
    <>
        <Head>
            <title>Thetatix</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <h1>Events Page</h1>
            <p>Welcome to the events page!</p>
        </main>
    </>
  );
}
