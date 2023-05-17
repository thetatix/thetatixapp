import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

function formatDate(rawDate) {
  const date = new Date(rawDate);
  const options = {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'};
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const utcDateString = formatter.format(date);
  const [dayOfWeek, month, dayOfMonth, year] = utcDateString.split(' ');
  return `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
}

function bufferToImg(buffer) {
  if (!buffer) {
      console.log('Buffer is undefined or empty.');
      return '/'; // or any default image URL you want to use
  }
  var img = Buffer.from(buffer, 'base64').toString('ascii');
  return img;
}


export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("/api/event/getEvents")
      .then((response) => response.json())
      .then((data) => setEvents(data.events))
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
          {categories.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.sectionContainer + ' container'}>
                <h2 className={styles.subtitle}>Categories</h2>
                <div className={styleCards.contentCategoryCards}>
                  {categories.map((category) => (
                        <Link href={`/category/${category._id}`} className={styleCards.categoryCard} key={category._id}>
                          <div className={styleCards.category}>
                            <Image
                              src={bufferToImg(category.img)}
                              alt="Category image"
                              className={styleCards.categoryImg}
                              width={1800}
                              height={1200}
                            />
                            <div className={styleCards.darken}></div>
                            <p className={styleCards.categoryName} key={category._id}>{category.categoryName}</p>
                          </div>
                        </Link>
                      )
                    )}
                </div>
              </div>
            </section>
          ) : null}
          {/* events */}
          <section className={styles.section}>
            <div className={styles.sectionContainer + ' container'}>
              <div className={styleCards.contentEventCards + ' row'}>
              {events.length > 0 ? (
                events.map((event) => {
                  return (
                    <Link href={`api/event/${event.contractAddress}`} className={styleCards.eventCard + ' col-4'} key={event.contractAddress}>
                      <div className={styleCards.event}>
                        <div className={styleCards.eventImg}>
                          <Image
                            src={bufferToImg(event.img.data)}
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
                            <p>{event.location}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <p>Loading events...</p>
              )}
              
              </div>
            </div>
          </section>
        </main>
    </>
  );
}
