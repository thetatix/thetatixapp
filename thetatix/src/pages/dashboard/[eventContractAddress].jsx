import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleEvent from '@/assets/styles/Event.module.css'

export default function EventPage() {
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
            return '/'; // or any default image URL you want to use
        }
        var img = Buffer.from(buffer, 'base64').toString('ascii');
        return img;
    }
  const router = useRouter();
  const { eventContractAddress } = router.query;
  const [event, setEvent] = useState({});
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (eventContractAddress) {
        fetch(`/api/event/getEvent?eventContractAddress=${eventContractAddress}`)
        .then((response) => response.json())
        .then((data) => {
            setEvent(data.event);
            return fetch(`/api/category/getCategory?categoryId=${data.event.category}`);
        })
        .then((response) => response.json())
        .then((data) => {
            setCategory(data[0]);
        })
        .catch((error) => console.error(error));
    }
  }, [eventContractAddress]);
  

  if (!event) {
    return <p>Loading event...</p>;
  }

  return (
    <>
        <Head>
            <title>{event.eventName}</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className='col-12'>
                            <p className={styles.breadcrumbs}>
                                <Link href="/dashboard">My created events</Link> / <Link href={"/dashboard/" + event.contractAddress}>{event.eventName}</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styles.content}>
                        <div className={styleEvent.event}>
                            <div className={styleEvent.eventImg}>
                                <Image
                                    src={bufferToImg(event.img)}
                                    alt="Event image"
                                    width={2400}
                                    height={1600}
                                />
                            </div>
                            <div className={styleEvent.eventInfo}>
                                <div className={styleEvent.title}>
                                    <h1>{event.eventName}</h1>
                                </div>
                                <div className={styleEvent.date}>
                                    <h2>Date and time</h2>
                                    <p>
                                        Starts {event.startDate}
                                        <br />
                                        Ends {event.endDate}
                                    </p>
                                </div>
                                <div className={styleEvent.location}>
                                    <h2>Location</h2>
                                    <p>{event.location}</p>
                                </div>
                                <div className={styleEvent.description}>
                                    <p>{event.eventDescription}</p>
                                </div>
                                <div className={styleEvent.tickets}>
                                    <p>
                                        Remaining tickets: <span className='ps-2'>{event.maxTickets - event.ticketsAmount}/{event.maxTickets}</span>
                                    </p>
                                </div>
                                <div className={styleEvent.price}>
                                    <span>
                                        {event.ticketsPrice / 1000000} TFUEL
                                    </span>
                                </div>
                                <div className={styleEvent.mint}>
                                    Mint
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
};
