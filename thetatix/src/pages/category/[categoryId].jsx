import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import OnlineEventCard from "@/components/OnlineEventCard";
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function CategoryPage() {
  
  function bufferToImg(buffer) {
    if (!buffer) {
        console.log('Buffer is undefined or empty.');
        return '/'; // or any default image URL you want to use
    }
    var img = Buffer.from(buffer, 'base64').toString('ascii');
    return img;
  }

  const router = useRouter();
  const { categoryId } = router.query;
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(`/api/category/getCategory?categoryId=${categoryId}`);
        const categoryData = await categoryResponse.json();
        setCategory(categoryData[0]);
        const eventsResponse = await fetch(`/api/event/getEventsByCategory?categoryId=${categoryId}`);
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
        console.log(categoryResponse.status);
        console.log(eventsResponse.status);
        if (categoryResponse.ok) {
            setLoading(false);
        } else {
            setLoading(true);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);
  return (
    <>
        <Head>
            {loading ? (
                <title>Loading category</title>
            ) : (
                <title>{category.categoryName}</title>
            )}
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            {loading ? (
                <section className={styles.section}>
                    <div className={styles.sectionContainer + ' container'}>
                        <div className={styleCards.contentEventCards}>
                            <p>Loading category...</p>
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    <header className={styles.header}>
                        <div className={styles.headerContainer + ' container'}>
                            <div className={styles.content + ' row'}>
                                <div className='col-12'>
                                    <div className={styles.categoryImg}>
                                        <Image
                                            src={bufferToImg(category.img)}
                                            alt="Category image"
                                            width={2400}
                                            height={1600}
                                            priority
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <p className={styles.breadcrumbs}>
                                        <Link href="/events">Events</Link> / <Link href={"/category/" + categoryId}>{category.categoryName}</Link>
                                    </p>
                                    <h1>{category.categoryName}</h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <section className={styles.section}>
                        <div className={styles.sectionContainer + ' container'}>
                            <div className={styleCards.contentEventCards + ' row'}>
                            {loading ? (
                                <p>Events loading...</p>
                            ) : (events.length > 0 ? (
                                    events.map((event) => {
                                        if (event.isOnlineEventStream) {
                                          return (
                                            <OnlineEventCard
                                              eventName={event.eventName}
                                              eventTicketsPrice={event.ticketsPrice}
                                              eventStartDate={event.startDate}
                                              eventLocation={event.location}
                                              eventImg={event.img.data}
                                              eventHref={`/dashboard`}
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
                                              eventImg={event.img.data}
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
                </>
            )}
        </main>
    </>
  );
}
