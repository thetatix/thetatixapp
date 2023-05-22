'use client';

import { createContext, useEffect, useState, useContext } from "react";

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
    <DataContext.Provider value={{ address, setAddress, isConnected, setIsConnected, theme, setTheme: updateTheme }}>
        {children}
    </DataContext.Provider>
);
}


