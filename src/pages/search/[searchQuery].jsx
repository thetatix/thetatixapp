import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/router"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@/assets/styles/Pages.module.css'
import styleForms from '@/assets/styles/Forms.module.css'
import styleSearch from '@/assets/styles/Search.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

import EventCard from '@/components/EventCard'
import OnlineEventCard from "@/components/OnlineEventCard";

import SearchBar from '@/components/SearchBar';

export default function Search() {

    const router = useRouter();
    const { searchQuery } = router.query;
    const inputRef = useRef(null);

    // useEffect(() => {
    //     if (searchQuery) {
    //       setInputQuery(searchQuery);
    //     }
    //   }, [searchQuery]);

    const submitForm = async (e) => {
        e.preventDefault();
        //// I want to redirect to /search/{sQuery}
        const inputValue = inputRef.current.value;
        router.push(`/search/${inputValue}`);
    }

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            fetch(`/api/event/getEventsBySearch?searchQuery=${searchQuery}`)
                .then((response) => response.json())
                .then((data) => setEvents(data.events))
        ])
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    };


    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    return (
        <>
            <Head>
                <title>Thetatix Search Events</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerContainer + ' container'}>
                        <div className={styles.content}>
                            {/* <SearchBar /> */}

                            <h1 className={styleSearch.title}>{searchQuery}</h1>
                        </div>
                    </div>
                </header>
                <section className={styles.section}>
                    <div className={styles.sectionContainer + ' container'}>
                        <div className={styles.content}>
                        <div className={styleCards.contentEventCards + ' row'}>
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
                    </div>
                </section>
            </main>
        </>
    );
}
