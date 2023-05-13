import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

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

function formatDate(rawDate) {
  const date = new Date(rawDate);
  const options = {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'};
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const utcDateString = formatter.format(date);
  const [dayOfWeek, month, dayOfMonth, year] = utcDateString.split(' ');
  return `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
}


export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("/api/event/getEvents")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error(error));
    fetch("/api/category/getCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
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
          {/* categories */}
          <section className={styles.section}>
            <div className={styles.sectionContainer + ' container'}>
              <h2>Categories</h2>
              <div className={styleCards.contentCategoryCards + ' row'}>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link href={`api/category/${category._id}`} className={styleCards.categoryCard + ' col-4'} key={category._id}>
                      <div>
                        <p key={category._id}>{category.categoryName}</p>
                      </div>
                    </Link>
                  ))
                ) : null}
              </div>
            </div>
          </section>
          {/* events */}
          <section className={styles.section}>
            <div className={styles.sectionContainer + ' container'}>
              <div className={styleCards.contentEventCards + ' row'}>
              {/* Para pruebas: */}
              {events.length > 0 ? (
                events.map((event) => {
                  const randomImage = getRandomImage(images);
                  return (
                    <Link href={`api/event/${event.contractAddress}`} className={styleCards.eventCard + ' col-4'} key={event.contractAddress}>
                      <div className={styleCards.event}>
                        <div className={styleCards.eventImg}>
                          <Image
                            src={'/img/' + randomImage.img}
                            alt="Event image"
                            width={2400}
                            height={1600}
                          />
                        </div>
                        <div className={styleCards.eventInfo}>
                          <div className={styleCards.eventTitle}>
                            <h4>{event.eventName}</h4>
                          </div>
                          <div className={styleCards.eventPrice}>
                            <span>{event.ticketsPrice} USDT</span>
                          </div>
                          <div className={styleCards.eventDate}>
                            <p>{formatDate(event.startDate)}</p>
                          </div>
                          <div className={styleCards.eventAddress}>
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
              {/* {events.length > 0 ? (
                events.map((event) => (
                  <Link href={`api/event/${event.contractAddress}`} className={styleCards.eventCard + ' col-4'} key={event.contractAddress}>
                    <div className={styleCards.event}>
                      <div className={styleCards.eventImg}>
                        <Image
                          src="/img/event-afterlife.png"
                          alt="Event image"
                          width={2400}
                          height={1600}
                        />
                      </div>
                      <div className={styleCards.eventInfo}>
                        <div className={styleCards.eventTitle}>
                          <h4>{event.eventName}</h4>
                        </div>
                        <div className={styleCards.eventPrice}>
                          <span>{event.ticketsPrice} USDT</span>
                        </div>
                        <div className={styleCards.eventDate}>
                          <p>{formatDate(event.startDate)}</p>
                        </div>
                        <div className={styleCards.eventAddress}>
                          <p>{event.address}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No events found.</p>
              )} */}
              
              </div>
            </div>
          </section>
        </main>
    </>
  );
}
