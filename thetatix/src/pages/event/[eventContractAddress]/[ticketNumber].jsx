import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { DataContext } from "@/context/DataContext";

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleEvent from '@/assets/styles/Ticket.module.css'

export default function TicketPage() {
  const [ticket, setTicket] = useState({});
  const router = useRouter();
  const { eventContractAddress, ticketNumber } = router.query;
  const { address } = useContext(DataContext);
  const [loading, setLoading] = useState(true);

  function bufferToImg(buffer) {
    if (!buffer) {
        return '/'; // or any default image URL you want to use
    }
    var img = Buffer.from(buffer, 'base64').toString('ascii');
    return img;
    }

  const formatAddress = (address) => {
      if (address?.length === 42) {
        return address.substring(0, 6) + "..." + address.substring(38);
      } else {
        return address;
      }
  }

  function formatDateTime(rawDateTime) {
      try {
          const dateTime = new Date(rawDateTime);
          const options = {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: 'UTC'
          };
          const formatter = new Intl.DateTimeFormat('en-US', options);
          const utcDateTimeString = formatter.format(dateTime);
          const [dayOfWeek, month, dayOfMonth, time, timePeriod] = utcDateTimeString.split(' ');
          const [hour, minute] = time.split(':');
          const period = timePeriod == "PM" ? 'p.m.' : 'a.m.';
          const formattedHour = hour % 12 || 12;
      
          return `${dayOfWeek} ${month} ${dayOfMonth} at ${formattedHour}:${minute} ${period}`;
      } catch(err) {
          return "Loading date...";
      }
  }

  function formatDescription(rawDescription) {
      if (!rawDescription) {
          return rawDescription;
      }
      const description = rawDescription.replace('/n', ' ');
      return description;
  }

  useEffect(() => {
    setLoading(true);
    if (eventContractAddress && ticketNumber) {
      // Fetch ticket details using eventContractAddress and ticketNumber
      fetch(`/api/tickets/getTicket?eventContractAddress=${eventContractAddress}&ticketNumber=${ticketNumber}`)
        .then((response) => response.json())
        .then((data) => {
          setTicket(data.ticket);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [eventContractAddress, ticketNumber]);

  return (
    <>
      <Head>
        {loading ? (
          <title>Ticket</title>
        ) : (
          <title>Ticket {ticket.ticketNumber}</title>
        )}
        <meta name="description" content="Ticket details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionContainer + ' container'}>
            <div className={styles.content}>
              {loading ? (
                <p>Loading ticket...</p>
              ) : (
                <div className={styleEvent.ticket}>
                  <div className={styleEvent.eventImg}>
                      <Image
                          src={'/img/wallpaper-3.png'}
                          alt="Event image"
                          width={2400}
                          height={1600}/>
                  </div>
                  <div className={styleEvent.ticketInfo}>
                    <div className={styleEvent.title}>
                      <h1>Ticket {ticket.ticketNumber}</h1>
                    </div>
                    <div className={styleEvent.creator}>
                        <h2>Owned by</h2>
                        <span onClick={() => copyToClipboard(ticket.creator)}> {/* Ese ticket.creator no se si esta bien */}
                            <abbr title={ticket.creator}>{formatAddress(ticket.owner)}</abbr> {/* Ese ticket.creator en title no se si esta bien */}
                        </span>
                    </div>
                    <div className={styleEvent.contractAddress}>
                        <h2>Event Contact Address</h2>
                        <span onClick={() => copyToClipboard(ticket.contractAddress)}> {/* Ese ticket.contractAddress no se si esta bien */}
                            <abbr title={ticket.contractAddress}>{formatAddress(ticket.eventContractAdress)}</abbr> {/* Ese ticket.contractAddress no se si esta bien */}
                        </span>
                    </div>
                    <div className={styleEvent.date}>
                        <h2>Date and time</h2>
                        <p>
                            Starts {formatDateTime(ticket.startDate)} {/* Aqui poner event en lugar de ticket */}
                            <br />
                            Ends {formatDateTime(ticket.endDate)} {/* Aqui poner event en lugar de ticket */}
                        </p>
                    </div>
                    <div className={styleEvent.location}>
                        <h2>Location</h2>
                        <p>{ticket.location}</p> {/* aqui poner event en lugar de ticket */}
                        <p>Paseo de la Reforma 56, México</p> {/* placeholder */}
                    </div>
                    <div className={styleEvent.description}>
                        <p>{formatDescription(ticket.eventDescription)}</p>
                        <p>Community-driven event that brings together developers, designers, and entrepreneurs to explore the latest trends and innovations in the Ethereum ecosystem. The event features a series of talks, workshops, and hackathons that aim to promote collaboration and innovation in the Ethereum community</p>
                    </div>

                    <div className={styleEvent.ticketLink}>
                      <p>{ticket.user ? 'Ticket already used' : 'Ticket available'}</p>
                    </div>
                    <p>Used: {ticket.user ? 'Yes' : 'No'}</p>
                    {ticket.user && <p>Used Date: {ticket.usedDate}</p>}
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
