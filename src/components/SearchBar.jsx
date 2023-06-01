import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/router"

import Image from 'next/image'

import styleSearch from '@/assets/styles/Search.module.css'

export default function SearchBar() {

    const router = useRouter();
    const { searchQuery } = router.query;
    const inputRef = useRef(null);

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

    return(
        <>
        <div className={styleSearch.searchBar}>
            <form action="" onSubmit={submitForm} method="POST" className={styleSearch.searchInput + ' input-group'}>
                <input aria-describedby="searchBtn"
                    id='searchQuery'
                    type="search"
                    name='searchQuery'
                    ref={inputRef}
                    className={styleSearch.input + ' form-control'} 
                    placeholder="Search for an event"
                    required
                />
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
        </>
    );

}