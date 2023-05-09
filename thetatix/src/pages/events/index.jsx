import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'

const images = [
  { id: 1, img: "event-afterlife.png" },
  { id: 2, img: "event-badbunny.png" },
  { id: 3, img: "event-devcon.png" },
  { id: 4, img: "event-e3.png" },
  { id: 5, img: "event-ethamsterdam.png" },
  { id: 6, img: "event-ethmexico.png" },
  { id: 7, img: "event-ethtokyo.png" },
  { id: 8, img: "event-ethwaterloo.png" },
  { id: 9, img: "event-nftnyc.png" },
  { id: 10, img: "event-rm.png" },
];

function getRandomImage(images) {
  return images[Math.floor(Math.random() * images.length)];
}

export default function Events() {

  // const [randomImage, setRandomImage] = useState(null);
  // useEffect(() => {
  //   const image = getRandomImage(images);
  //   setRandomImage(image);
  // }, []);
  

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
              <div className={styles.content + ' row'}>
                <div className="col-12">
                  <h1>Events</h1>
                </div>
              </div>
            </div>
          </header>
          <section className={styles.section}>
            <div className={styles.sectionContainer + ' container'}>
              <div className={styles.content + ' row'}>
                
              {/* Para pruebas: */}
              {events.length > 0 ? (
                events.map((event) => {
                  const randomImage = getRandomImage(images);
                  return (
                    <Link href={`api/event/${event._id}`} className={styles.eventCard + ' col-4'} key={event._id}>
                      <div className={styles.event}>
                        <div className={styles.eventImg}>
                          <Image
                            src={'/img/' + randomImage.img}
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
                            <span>{event.price} USDT</span>
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
                    );
                  })
                ) : (
                  <p>No events found.</p>
                )}

              {/* Correcto: */}
              {/* {events.map((event) => (
                <Link href={`api/event/${event._id}`} className={styles.eventCard + ' col-4'} key={event._id}>
                <div className={styles.event}>
                  <div className={styles.eventImg}>
                    <Image
                      src="/img/event-afterlife.png"
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
                      <span>{event.price} USDT</span>
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
              ))} */}
              
              </div>
            </div>
          </section>
        </main>
    </>
  );
}
