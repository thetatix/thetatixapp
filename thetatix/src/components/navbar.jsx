import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navbarContainer + ' container'}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoImg}>
              <Image
                src="/next.svg"
                alt="Thetatix Logo"
                width={180}
                height={37}
                priority
              />
            </Link>
          </div>
          <div className={styles.center}>
            <ul>
              <li>
                <Link href="/" className={styles.navLink}>
                  My tickets
                </Link>
              </li>
              <li>
                <Link href="/events" className={styles.navLink}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/" className={styles.navLink}>
                  Create an event
                </Link>
              </li>
            </ul>
            <div className={styles.searchBar}></div>
          </div>
          <div className={styles.connectBtn}>
            <button>Connect wallet</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
