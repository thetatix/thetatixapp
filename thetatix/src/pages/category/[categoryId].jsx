import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function CategoryPage() {

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
    // Solo para prubeas, borrar lo siguiente al terminar
    var ok = img[0] + img[1] + img[2] + img[3];
    if (ok != "data") {
      img = "/img/" + img;
    }
    // borrar hasta aqui
    return img;
  }

  const router = useRouter();
  const { categoryId } = router.query;
  const [category, setCategory] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
        fetch(`/api/event/getEventsByCategory?categoryId=` + categoryId)
        .then((response) => response.json())
        .then((data) => setEvents(data.events))
        .catch((error) => console.error(error));
    };

    const fetchCategory = async () => {
        fetch(`/api/category/getCategory?categoryId=` + categoryId)
        .then((response) => response.json())
        .then((data) => setCategory(data[0]))
        .catch((error) => console.error(error));
    };

    // const fetchCategory = async () => {
    //     try {
    //         const response = await fetch(`/api/category/getCategory?categoryId=${categoryId}`);
    //         const data = await response.json();
    //         setCategory(data.category);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    if (categoryId) {
        fetchCategory();
        fetchEvents();
    }
  }, [categoryId]);

  return (
    <>
        <Head>
            <title>{category.categoryName}</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                <div className={styles.content + ' row'}>
                    <div className='col-12'>
                        <Image
                            src={bufferToImg(category.img)}
                            alt="Category image"
                            width={2400}
                            height={1600}
                        />
                    </div>
                    <div className="col-12">
                        <h1>Category: {categoryId}</h1>
                        <h1>Name: {category.categoryName}</h1>
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
