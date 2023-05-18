import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function Dashboard() {

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

  const { address, setAddress, isConnected, setIsConnected } =  useContext(DataContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
        fetch(`/api/event/getEventsByCreator?creator=` + address)
        .then((response) => response.json())
        .then((data) => setEvents(data.events))
        .catch((error) => console.error(error));
    };

    if (address) {
        fetchEvents();
    }
  }, [address]);

  return (
    <>
        <Head>
            <title>My events</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className="col-12">
                            <h1>My events</h1>
                        </div>
                    </div>
                </div>
            </header>
            {/* events */}
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styleCards.contentEventCards + ' row'}>
                    {/* Correcto: */}
                    {events.length > 0 ? (
                        events.map((event) => {
                            return (
                            <Link href={`/event/${event.contractAddress}`} className={styleCards.eventCard + ' col-4'} key={event.contractAddress}>
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
                                            <span>{event.ticketsPrice / 1000000} TFUEL</span>
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
                        events.length === 0 ? (
                            <p>No events found</p>
                        ) : (
                            <p>Loading events...</p>
                        )
                    )}
                    
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
