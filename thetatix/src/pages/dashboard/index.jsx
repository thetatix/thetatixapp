import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import OnlineEventCardCreatorOnly from "@/components/OnlineEventCard";
import Head from 'next/head'
import EventCard from '@/components/EventCard'
import styles from '@/assets/styles/Pages.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

export default function Dashboard() {
  const { address, setAddress, isConnected, setIsConnected } =  useContext(DataContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all([
        fetch(`/api/event/getEventsByCreator?creator=` + address)
            .then((response) => response.json())
            .then((data) => setEvents(data.events))
    ])
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }, [address]);

  return (
    <>
        <Head>
            <title>My created events</title>
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
            {/* events */}
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styleCards.contentEventCards + ' row'}>
                    {/* Correcto: */}
                    {loading ? (
                        <p>Loading events...</p>
                    ) : (events.length > 0 ? (
                            events.map((event) => {
                                if(event.isOnlineEventStream){
                                    return <OnlineEventCardCreatorOnly
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
                                }else{
                                    return (
                                        <EventCard
                                            eventName={event.eventName}
                                            eventTicketsPrice={event.ticketsPrice}
                                            eventStartDate={event.startDate}
                                            eventLocation={event.location}
                                            eventImg={event.img.data}
                                            eventHref={`/dashboard`}
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
