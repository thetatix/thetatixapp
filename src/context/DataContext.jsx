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

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
}

const formatAddress = (address) => {
    if (address?.length === 42) {
      return address.substring(0, 6) + "..." + address.substring(38);
    } else {
      return address;
    }
}

function formatDateTime(rawDateTime) {
    if (rawDateTime) {
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
            return rawDateTime;
        }
    } else {
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

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [ModalActive, setModalActive] = useState(false);
    const [ModalStatus, setModalStatus] = useState('loading');
    const [ModalMessage, setModalMessage] = useState('message');
    const [ModalCloseable, setModalCloseable] = useState(false);

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [theme, setTheme] = useState("dark");

    const toggleOpenNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    }
    const closeNavbar = () => {
        setIsNavbarOpen(false);
    }

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
    <DataContext.Provider value={{ address, setAddress, isConnected, setIsConnected, username, setUsername, theme, setTheme: updateTheme, bufferToImg, formatDate, copyToClipboard, formatAddress, formatDateTime, formatDescription, ModalActive, setModalActive, ModalStatus, setModalStatus, ModalMessage, setModalMessage, ModalCloseable, setModalCloseable, isNavbarOpen, setIsNavbarOpen, toggleOpenNavbar, closeNavbar }}>
        {children}
    </DataContext.Provider>
);
}


