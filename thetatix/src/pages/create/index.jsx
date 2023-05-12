import { useState, useEffect } from "react"
import useContracts from '../../components/contractsHook/useContract'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Pages.module.css'
import styleCreate from '@/assets/styles/Forms.module.css'

export default function Create() {
    const [formData, setFormData] = useState({
        contractAddress: "",
        creator: "", //adress of creator,
        maxTickets: 1,
        eventName: "",
        ticketsPrice:0,
        eventDescription: "",
        startDate: "",
        endDate: "",
        img: "",
        location : "",
        category: ""
    });
    const [alert, setAlert] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [formStatusMsg, setFormStatusMsg] = useState("");

    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        setFormData((prevState) => ({
          ...prevState,
          [fieldName]: fieldValue
        }));
    }

    const submitForm = async (e) => {
        e.preventDefault();
        //DETERMINAR EL SIGNER DE METAMASK
        const contract = new useContracts(signer);
        const response = contract.createEventTickets(formData.name,
            formData.eventDescription,formData.ticketsPrice,
            formData.maxTickets,formData.startDate,
            formData.endDate,formData.location)
        if (response.error == null) {
            var resJson = await response.json();
            setAlert(true);
            setFormStatus("success");
            setFormStatusMsg(resJson.message);
        } else {
            var resJson = await response.json();
            setAlert(true);
            setFormStatus("error");
            setFormStatusMsg(resJson.message);
        }
    }
    
    const getToday = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
        dd = '0' + dd;
        }
        if (mm < 10) {
        mm = '0' + mm;
        }    
        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch("/api/category/getCategories")
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error(error));
    }, []);

  return (
    <>
        <Head>
            <title>Thetatix Create Event</title>
            <meta name="description" content="Thetatix web app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            {/* form status can be "success" or "error" */}
            {alert &&
                <div className={styles.alert + ' ' + formStatus}>
                    <p>{formStatusMsg} alerta</p>
                </div>
            }
            <div className={styles.mainContainer + ' container'}>
                <div className={styles.content + ' row'}>
                    <div className={styles.column + ' col-7'}>
                        <header className={styles.header}>
                            <h1>Let's create your event</h1>
                            <p className={styles.subtitle}>Creating your event is free, it only costs the transaction fee.</p>
                        </header>
                        <section className={styles.section}>
                            <div className={styles.sectionContainer}>
                                <div className={styles.content}>
                                    <form action="/api/event/newEvent" onSubmit={submitForm} method="POST" className={styleCreate.form}>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-12'}>
                                                <label htmlFor="eventName" className={styleCreate.label}>Name of the event</label>
                                                <input
                                                id='eventName'
                                                type="text"
                                                name='eventName'
                                                value={formData.eventName}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                placeholder="Web3 in person hackathon..."
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-12'}>
                                                <label htmlFor="eventDescription" className={styleCreate.label}>Description</label>
                                                <textarea
                                                id="eventDescription"
                                                name="eventDescription"
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                rows="4"
                                                placeholder="The best experience..."
                                                value={formData.eventDescription}
                                                required
                                                >
                                                </textarea>
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-12'}>
                                                <label htmlFor="img" className={styleCreate.label}>Event image</label>
                                                {/* no terminado */}
                                                <input
                                                id="img"
                                                type="file"
                                                name="img"
                                                value={formData.img}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                />
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-12'}>
                                                <label htmlFor="category" className={styleCreate.label}>Category</label>
                                                {/* no terminado */}
                                                <select
                                                id="category"
                                                name="category"
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                >
                                                    <option value="">Select a category</option>
                                                    {categories.map((category) => (
                                                        <option key={category._id} value={category._id}>{category.categoryName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-12'}>
                                                <label htmlFor="location" className={styleCreate.label}>Location</label>
                                                <input
                                                id='location'
                                                // no terminado
                                                // type="location"
                                                name='location'
                                                value={formData.location}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-6'}>
                                                <label htmlFor="startDate" className={styleCreate.label}>Start date</label>
                                                <input
                                                id='startDate'
                                                type="date"
                                                name='startDate'
                                                value={formData.startDate}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                min={getToday()}
                                                required
                                                />
                                            </div>
                                            <div className={styleCreate.column + ' col-6'}>
                                                <label htmlFor="endDate" className={styleCreate.label}>End date</label>
                                                <input
                                                id='endDate'
                                                type="date"
                                                name='endDate'
                                                value={formData.endDate}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                min={getToday()}
                                                required
                                                />
                                            </div>
                                        </div>
                                        {/* no hay time en el scheme */}
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-6'}>
                                                <label htmlFor="startTime" className={styleCreate.label}>Start time</label>
                                                <input
                                                id='startTime'
                                                type="time"
                                                name='startTime'
                                                value={formData.startTime}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                required
                                                />
                                            </div>
                                            <div className={styleCreate.column + ' col-6'}>
                                                <label htmlFor="endingTime" className={styleCreate.label}>Ending time</label>
                                                <input
                                                id='endingTime'
                                                type="time"
                                                name='endingTime'
                                                value={formData.endingTime}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-6'}>
                                                <label htmlFor="maxTickets" className={styleCreate.label}>Tickets amount</label>
                                                <input
                                                id='maxTickets'
                                                type="number"
                                                name='maxTickets'
                                                value={formData.maxTickets}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                min="1"
                                                required
                                                />
                                            </div>
                                            <div className={styleCreate.column + ' col-6'}>
                                                <label htmlFor="ticketsPrice" className={styleCreate.label}>Tickets price</label>
                                                {/* no hay price */}
                                                <input
                                                id='ticketsPrice'
                                                type="number"
                                                name='ticketsPrice'
                                                value={formData.ticketsPrice}
                                                onChange={handleInput}
                                                className={styleCreate.input}
                                                min="0"
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className={styleCreate.row + ' row'}>
                                            <div className={styleCreate.column + ' col-12'}>
                                                <button type="submit" className={styleCreate.submit}>Create event</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className={styles.column + ' col-5'}>
                        <section className={styles.sideImgSection}>
                            <div className={styles.sideImgContainer}>
                                <Image
                                    src="/img/wallpaper-3.png"
                                    alt="Event image"
                                    width={2400}
                                    height={1600}
                                    priority
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
}
