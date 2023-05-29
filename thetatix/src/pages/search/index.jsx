import { useState, useEffect } from "react"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@/assets/styles/Pages.module.css'
import styleForms from '@/assets/styles/Forms.module.css'
import styleSearch from '@/assets/styles/Search.module.css'
import styleCards from '@/assets/styles/Cards.module.css'

import EventCard from '@/components/EventCard'
import OnlineEventCard from "@/components/OnlineEventCard";


export default function Search() {

    const submitForm = async (e) => {
        // e.preventDefault();
    }

    const [events, setEvents] = useState([]);

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
                <title>Thetatix Search Events</title>
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerContainer + ' container'}>
                        <div className={styles.content}>
                            
                            <div className={styleSearch.searchBar}>
                                <form action="" onSubmit={submitForm} method="POST" className={styleSearch.searchInput + ' input-group'}>
                                    <input type="search" className={styleSearch.input + ' form-control'} placeholder="Search for an event" aria-describedby="searchBtn" />
                                    <button id="searchBtn" type="submit">
                                    <Image
                                        src="/icons/search.svg"
                                        alt="Search icon"
                                        width={40}
                                        height={40}
                                    />
                                    </button>
                                </form>
                            </div>
                            <h1 className={styleSearch.title}>Search for an event</h1>

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
                    </div>
                </section>
            </main>
        </>
    );
}
