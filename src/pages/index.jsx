import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";

import styleHome from '@/assets/styles/Home.module.css'
import EventCard from '@/components/EventCard'
import OnlineEventCard from "@/components/OnlineEventCard";
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { bufferToImg } = useContext(DataContext);
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
        <title>Thetatix</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Thetatix web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styleHome.main}>
        <header className={styleHome.header}>
          <div className={styleHome.headerContainer + ' container'}>
            <div className={styleHome.content + ' row'}>
              <div className={styleHome.column + ' col'}>
                <p className={styleHome.title}>
                  Web3 ticketing for <span className={styleHome.highlightText}>online</span> streaming and in person events
                </p>
                <p className={styleHome.subtitle}>
                  Powered by Theta Network
                  <Image
                    src="/img/full-theta-icon.svg"
                    alt="Theta network icon"
                    width={24}
                    height={24}
                    priority
                  />
                </p>
              </div>
              <div className={styleHome.column + ' col'}>
                <Link href="/" className={styleHome.eventCard}>
                  <div className={styleHome.event}>
                    <div className={styleHome.eventImg}>
                      <Image
                        src="/img/event-thetacon-live-2.png"
                        alt="Event image"
                        width={1200}
                        height={800}
                        priority
                      />
                    </div>
                    <p>
                      <strong>ThetaCon 2023 Livestream (Example)</strong>
                      <br />
                      Jun 2, 10:00 A.M. - Jun 5, 8:00 P.M.
                      <br />
                      Online
                    </p>
                  </div>
                </Link>
                {/* <div className={styleHome.squareRight}></div> */}
                <Image className={styleHome.blurRight} src="/img/right-blur.png" alt="" width={900} height={900} />
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
                            src={'/img/' + category._id + '.png'}
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
            <h2 className={styles.subtitle + ' mt-5 pt-3 mb-2'}>Upcoming events</h2>
            <div className={styleCards.contentEventCards + ' row pt-0'}>
            {loading ? (
              <p>Loading events...</p>
            ) : (events.length > 0 ? (
                events.map((event) => {
                  if (event.isOnlineEventStream) {
                    return (
                      <OnlineEventCard
                        eventName={event.eventName}
                        eventTicketsPrice={event.ticketsPrice}
                        eventStartDate={event.startDate}
                        eventLocation={event.location}
                        eventImg={event.category}
                        eventHref={`/event`}
                        eventContractAddress={event.contractAddress}
                        key={event.contractAddress}
                        stream_key={event.stream_key}
                        stream_server={event.stream_server}
                        stream_playback_url={event.stream_playback_url}
                      />
                    )
                  } else {
                    return (
                      <EventCard
                        eventName={event.eventName}
                        eventTicketsPrice={event.ticketsPrice}
                        eventStartDate={event.startDate}
                        eventLocation={event.location}
                        eventImg={event.category}
                        eventHref={`/event`}
                        eventContractAddress={event.contractAddress}
                        key={event.contractAddress}
                      />
                    )
                  }
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