import { useContext, useState, useEffect } from "react"
import { ethers } from "ethers"
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/assets/styles/Pages.module.css'
import styleCreate from '@/assets/styles/Forms.module.css'
import DynamicModal from "@/components/DynamicModal"
import { DataContext } from "@/context/DataContext";
import useContracts from '@/components/contractsHook/useContract';

export default function Create() {
    //STATE MODAL
    //PAGE STATES
    const { address, isConnected, setModalActive, setModalStatus, setModalMessage, setModalCloseable } = useContext(DataContext);

    const [formData, setFormData] = useState({
        // contractAddress: "",
        // creator: "", //adress of creator,
        maxTickets: 1,
        eventName: "",
        ticketsPrice: 0,
        eventDescription: "",
        startDate: "",
        endDate: "",
        img: "",
        location: "",
        category: "",
        eventtype: "",
        api_key: "",
        api_secret: ""
    });
    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        // console.log(file);
        const reader = new FileReader();
        // console.log(reader);
        reader.onloadend = () => {
            setFormData((prevState) => ({
                ...prevState,
                img: reader.result,
            }));
        };
        // console.log(formData.img);
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setModalActive(true);
        //DETERMINAR EL SIGNER DE METAMASK
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        if (!isConnected) {
            setModalMessage('Please connect your wallet to create an event.')
            setModalStatus('danger');
            setModalCloseable(true);
            return
        } else {
            setModalMessage('Please sign the contract to continue with this progress.');
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new useContracts(signer);
            setModalCloseable(false);
            setModalStatus('loading');
            setModalMessage('Your event is being created. Please DO NOT close, reload, or modify this page, as it may cause your event creation to fail. It might take some time.');
            try {
                const response = await contract.createEventTickets(
                    address,
                    formData.maxTickets,
                    formData.eventName,
                    formData.ticketsPrice,
                    formData.eventDescription,
                    formData.startDate,
                    formData.img,
                    formData.endDate,
                    formData.location,
                    formData.category,
                    formData.eventtype,
                    formData.api_key,
                    formData.api_secret
                )
                setModalStatus(response.status);
                setModalMessage(response.message);
                setModalCloseable(true);
            } catch (response) {
                setModalStatus(response.status);
                setModalMessage(response.message);
                setModalCloseable(true);
            }
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
            <DynamicModal />
            <Head>
                <title>Thetatix Create Event</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.mainContainer + ' container'}>
                    <div className={styles.content + ' row'}>
                        <div className={styles.column + ' col-12 col-sm-7'}>
                            <header className={styles.header}>
                                <h1>Let's create your event</h1>
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
                                                    <input
                                                        id="img"
                                                        type="file"
                                                        accept="image/*"
                                                        name="img"
                                                        onChange={handleFileInput}
                                                        className={styleCreate.input}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styleCreate.row + ' row'}>
                                                <div className={styleCreate.column + ' col-12'}>
                                                    <label htmlFor="category" className={styleCreate.label}>Category</label>
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
                                                    <label htmlFor="eventtype" className={styleCreate.label}>Event type</label>
                                                    <select
                                                        id="eventtype"
                                                        name="eventtype"
                                                        onChange={handleInput}
                                                        className={styleCreate.input}
                                                    >
                                                        <option value={''}> Select an event type</option>
                                                        <option value={'offline'}>In person event</option>
                                                        <option value={'online'}>Online event (stream)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {formData.eventtype === 'offline' ? (
                                                <div className={styleCreate.row + ' row'}>
                                                    <div className={styleCreate.column + ' col-12'}>
                                                        <label htmlFor="location" className={styleCreate.label}>Location</label>
                                                        <input
                                                            id='location'
                                                            type="text"
                                                            name='location'
                                                            placeholder="Enter your city"
                                                            value={formData.location}
                                                            onChange={handleInput}
                                                            className={styleCreate.input}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ) : null}
                                            {formData.eventtype === 'online'
                                                ?
                                                <>
                                                    <div className={styleCreate.row + ' row'}>
                                                        <div className={styleCreate.column + ' col-12'}>
                                                            <label htmlFor="api_key" className={styleCreate.label}>
                                                                API KEY (from thetavideoapi.com)
                                                                <div className={styles.tooltip}>
                                                                    <div className={styles.tooltipIcon}>
                                                                        <Image
                                                                            src="/icons/help-circle.svg"
                                                                            alt="Help icon"
                                                                            width={24}
                                                                            height={24}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.tooltipBody}>
                                                                        <p>
                                                                            1.- Create an account on thetavideoapi.com
                                                                            <br />
                                                                            2.- Create an app
                                                                            <br />
                                                                            3.- Get the API_KEY of the app and paste it here
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <input
                                                                id='api_key'
                                                                type="text"
                                                                name='api_key'
                                                                value={formData.api_key}
                                                                onChange={handleInput}
                                                                className={styleCreate.input}
                                                                placeholder="Ex. srvacc_xxxxxxxxxxxxxxxxxxxxxxxxx"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={styleCreate.row + ' row'}>
                                                        <div className={styleCreate.column + ' col-12'}>
                                                            <label htmlFor="api_secret" className={styleCreate.label}>
                                                                API SECRET (from thetavideoapi.com)
                                                                <div className={styles.tooltip}>
                                                                    <div className={styles.tooltipIcon}>
                                                                        <Image
                                                                            src="/icons/help-circle.svg"
                                                                            alt="Help icon"
                                                                            width={24}
                                                                            height={24}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.tooltipBody}>
                                                                        <p>
                                                                            1.- Create an account on thetavideoapi.com
                                                                            <br />
                                                                            2.- Create an app
                                                                            <br />
                                                                            3.- Get the SECRETAPI_KEY of the app and paste it here
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <input
                                                                id='api_secret'
                                                                type="text"
                                                                name='api_secret'
                                                                value={formData.api_secret}
                                                                onChange={handleInput}
                                                                className={styleCreate.input}
                                                                placeholder="Ex. 37zdaeb0c8kw3aphua76x9bee5tmxvjt"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <></>
                                            }
                                            <div className={styleCreate.row + ' row'}>
                                                <div className={styleCreate.column + ' col-6'}>
                                                    <label htmlFor="startDate" className={styleCreate.label}>Start date</label>
                                                    <input
                                                        id='startDate'
                                                        type="datetime-local"
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
                                                        type="datetime-local"
                                                        name='endDate'
                                                        value={formData.endDate}
                                                        onChange={handleInput}
                                                        className={styleCreate.input}
                                                        min={getToday()}
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
                                                    <label htmlFor="ticketsPrice" className={styleCreate.label}>Tickets price (TFUEL)</label>
                                                    {/* no hay price */}
                                                    <input
                                                        id='ticketsPrice'
                                                        type="number"
                                                        name='ticketsPrice'
                                                        value={formData.ticketsPrice}
                                                        onChange={handleInput}
                                                        className={styleCreate.input}
                                                        min="0"
                                                        step=".01"
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
                        <div className={styles.column + ' col-12 col-sm-5'}>
                            <section className={styles.sideImgSection}>
                                <div className={styles.sideImgContainer}>
                                    <Image
                                        src={formData.img !== "" ? formData.img : "/img/wallpaper-3.png"}
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
