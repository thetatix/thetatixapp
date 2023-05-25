import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function Events() {
  function bufferToImg(buffer) {
    if (!buffer) {
        console.log('Buffer is undefined or empty.');
        return '/'; // or any default image URL you want to use
    }
    var img = Buffer.from(buffer, 'base64').toString('ascii');
    return img;
  }
  
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all([
        fetch("/api/event/getEvents")
            .then((response) => response.json())
            .then((data) => setEvents(data.events)),
        fetch("/api/category/getCategories")
            .then((response) => response.json())
            .then((data) => setCategories(data))
    ])
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
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
              {loading ? (
                <p>Loading events...</p>
              ) : (events.length > 0 ? (
                  events.map((event) => {
                    return (
                      <EventCard
                        eventName={event.eventName}
                        eventTicketsPrice={event.ticketsPrice}
                        eventStartDate={event.startDate}
                        eventLocation={event.location}
                        eventImg={event.img.data}
                        eventHref={`/event`}
                        eventContractAddress={event.contractAddress}
                        eventIsOnline={event.isOnlineEventStream}
                        key={event.contractAddress}
                      />
                    )
                  })
                ) : (
                  <p>No events found</p>
                )
              )}
              </div>
            </div>
          </section>
        </main>
    </>
  );
}
