import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Cards.module.css'

function formatDate(rawDate) {
    const date = new Date(rawDate);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
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

export default function OnlineEventCardCreatorOnly({ eventName, eventTicketsPrice, eventStartDate, eventLocation, eventImg, eventHref, eventContractAddress,stream_key,stream_server,stream_playback_url }) {
    return (
        <Link href={eventHref + '/' + eventContractAddress} className={styles.eventCard + ' col-4'} key={eventContractAddress}>
            <div className={styles.event}>

                <div className={styles.eventImg}>
                    <Image
                        src={bufferToImg(eventImg)}
                        alt="Event image"
                        width={2400}
                        height={1600}
                    />
                </div>
                <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>
                        <h4>{eventName}</h4>
                    </div>
                    <div className={styles.eventPrice}>
                        <span>{eventTicketsPrice / 1000000} TFUEL</span>
                    </div>
                    <div className={styles.eventInfo}>
                        ONLINE EVENT
                    </div>
                    <div className={styles.eventDate}>
                        <p>{formatDate(eventStartDate)}</p>
                    </div>
                    <div className={styles.eventAddress}>
                        <p>{eventLocation}</p>
                    </div>
                    <div>
                        <div>
                            stream key:{stream_key}{/*  {stream_key.substring(0, 6)}...{stream_key.substring(stream_key.length-6,stream_key.length)} */}
                        </div>
                        <div>
                            stream server: {stream_server}
                        </div>
                        <div>
                            {stream_playback_url.length>0 ? <div>
                                touch here for start the stream
                            </div> : <div>
                                started stream, url of stream: {window.location.href}/onlineevents/{eventContractAddress}
                                </div>}
                            
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}