import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
        <Head>
            <title>Thetatix Events</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerContainer + ' container'}>
              <div className={styles.content}>
                <h1>Events</h1>
              </div>
            </div>
          </header>
          <section className={styles.section}>
            <div className={styles.sectionContainer + ' container'}>
              <div className={styles.content}>
                
              {events.map((event) => (
                <Link href={`api/event/${event._id}`} className={styles.eventCard} key={event._id}>
                  <div className={styles.event}>
                    <div className={styles.eventImg}>
                      <Image
                        src="/img/example_event_img.jpg"
                        alt="Event image"
                        width={2400}
                        height={1600}
                      />
                    </div>
                    <div className={styles.eventInfo}>
                      <div className={styles.eventTitle}>
                        <h4>{event.title}</h4>
                      </div>
                      <div className={styles.eventPrice}>
                        <span>{event.price}</span>
                      </div>
                      <div className={styles.eventDate}>
                        <p>{event.date}</p>
                      </div>
                      <div className={styles.eventAddress}>
                        <p>{event.address}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              </div>
            </div>
          </section>
        </main>
    </>
  );
}
