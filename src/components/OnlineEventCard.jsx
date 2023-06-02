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

export default function OnlineEventCard({ eventName, eventTicketsPrice, eventStartDate, eventLocation, eventImg, eventHref, eventContractAddress, stream_key, stream_server, stream_playback_url }) {
    return (
        <Link href={eventHref + '/' + eventContractAddress} className={styles.eventCard + ' col-12 col-sm-4'} key={eventContractAddress}>
            <div className={styles.event}>

                <div className={styles.eventImgOnline}>
                    <Image
                        src={'/img/' + eventImg + '.png'}
                        alt="Event image"
                        width={2400}
                        height={1600}
                    />
                    <p>Online</p>
                </div>
                <div className={styles.eventInfo}>
                    <div className={styles.eventTitle}>
                        <h4>{eventName}</h4>
                    </div>
                    <div className={styles.eventPrice}>
                        <span>{eventTicketsPrice / 1000000} TFUEL</span>
                    </div>
                    <div className={styles.eventDate}>
                        <p>{formatDate(eventStartDate)}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}