import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Head from 'next/head'

import DashboardCard from '@/components/DashboardCard'

import styles from '@/assets/styles/Pages.module.css'

export default function Dashboard() {
  const { address, isConnected } =  useContext(DataContext);
  const [events, setEvents] = useState([]);
  const [inPersonEvents, setInPersonEvents] = useState([]);
  const [onlineEvents, setOnlineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all([
        fetch(`/api/event/getEventsByCreator?creator=` + address)
            .then((response) => response.json())
            .then((data) => {
                const filteredInPersonEvents = data.events.filter((event) => !event.isOnlineEventStream);
                const filteredOnlineEvents = data.events.filter((event) => event.isOnlineEventStream);
                setEvents(data.events);
                setInPersonEvents(filteredInPersonEvents);
                setOnlineEvents(filteredOnlineEvents);
            })
    ])
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }, [address]);

  return (
    <>
        <Head>
            <title>My created events</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className="col-12">
                            <h1>My created events</h1>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styles.content}>
                        {isConnected ? (loading ? (
                            <p>Loading...</p>
                            ) : events.length > 0 ? (
                                <>
                                    {inPersonEvents.length > 0 && (
                                        <DashboardCard num={1} headTitle={"In person events"} events={inPersonEvents} />
                                    )}
                                    {onlineEvents.length > 0 && (
                                        <DashboardCard num={2} headTitle={"Online events"} events={onlineEvents} />
                                    )}
                                </>
                            ) : (
                                <p>No events found.</p>
                            )
                        ) : (
                            <p>Wallet not connected.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
