import { useContext, useEffect, useState } from "react";
import Head from 'next/head'
import { DataContext } from "@/context/DataContext";
import DynamicModal from "@/components/DynamicModal"

import styles from '@/assets/styles/Pages.module.css'
import styleProfile from '@/assets/styles/Profile.module.css'

export default function Profile() {
    const { address, isConnected, username, setUsername, ModalActive, setModalActive, ModalStatus, setModalStatus, ModalMessage, setModalMessage, ModalCloseable, setModalCloseable } =  useContext(DataContext);
    const [inputUsername, setInputUsername] = useState('');
    const submitForm = async (e) => {
        e.preventDefault();
        setModalActive(true);
        setModalMessage('Setting your username.')
        setModalStatus('loading');
        setModalCloseable(false);
        if (!isConnected) {
            setModalActive(true);
            setModalMessage('Please connect your wallet to set a username.')
            setModalStatus('danger');
            setModalCloseable(true);
            return
        }
        try {
            const raw_data = {
                walletAddress: address,
                username: inputUsername
            }
            const data = JSON.stringify({ data: raw_data });
            const response = await fetch('/api/user/setUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            });
            const responseData = await response.json();
            if (response.ok) {
                setUsername(responseData.data.username);
                setModalMessage(responseData.message);
                setModalStatus('success');
                setModalCloseable(true);
            } else {
                setModalMessage(responseData.message);
                setModalStatus('danger');
                setModalCloseable(true);
            }
        } catch (err) {
            const errData = data.json();
            setModalMessage(`There was an error setting up your username. ${errData.message}`)
            setModalStatus('danger');
            setModalCloseable(true);
        }
    }
    useEffect(() => {
        if (isConnected) {
            setInputUsername(username);
        }
      }, [username, isConnected]);

  return (
    <>
        <DynamicModal />
        <Head>
            <title>Profile</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styleProfile.main}>
            <header className={styles.header}>
                <div className={styles.headerContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className="col-12">
                            <h1 className={styleProfile.title}>Your username goes here</h1>
                            <p className={styleProfile.subtitle}>Usernames are usefull for livestream events</p>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <div className={styles.sectionContainer + ' container'}>
                    <div className={styles.content}>
                        <form action='/api/user/setUser' onSubmit={submitForm} method="POST" className={styleProfile.form}>
                            <label htmlFor="username">Write username</label>
                            <input
                                id="username"
                                type="text"
                                value={inputUsername}
                                onChange={(event) => setInputUsername(event.target.value)}
                                required
                            />
                            <button type="submit">Save username</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
