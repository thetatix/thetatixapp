import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCreate from '@/assets/styles/Create.module.css'

export default function Create() {
  return (
    <>
        <Head>
            <title>Thetatix Create Event</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <div className={styles.mainContainer + ' container'}>
                <div className={styles.content + ' row'}>
                    <div className={styles.column + ' col-7'}>
                        <header className={styles.header}>
                            <h1>Let's create your event</h1>
                        </header>
                        <section className={styles.section}>
                            <div className={styles.sectionContainer}>
                                <div className={styles.content}>
                                    <form action="" className={styleCreate.form}></form>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className={styles.column + ' col-5'}>
                        <section className={styles.section}>
                            <div className={styles.sectionContainer}>
                                <div className={styles.content}>
                                    Aqui va la imagen
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
}
