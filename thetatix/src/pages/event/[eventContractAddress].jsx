import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

const EventPage = () => {
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
                                <a href="/events">Events</a> / <a href={"/category/" + event.category}>{category.categoryName}</a> / <a href={"/event/" + event.contractAddress}>{event.eventName}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className='col-12'>
                            <h1>{event.eventName}</h1>
                            <p>Location: {event.location}</p>
                            <p>Date: {event.date}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
};

export default EventPage;
