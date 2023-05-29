'use client';

import { createContext, useEffect, useState, useContext } from "react";

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

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [address, setAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Retrieve theme preference from local storage or any other source
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const updateTheme = (newTheme) => {
        // Update theme in state
        setTheme(newTheme);
        // Save theme preference to local storage or any other desired storage
        localStorage.setItem("theme", newTheme);
    };

return(
    <DataContext.Provider value={{ address, setAddress, isConnected, setIsConnected, theme, setTheme: updateTheme, bufferToImg, formatDate }}>
        {children}
    </DataContext.Provider>
);
}


