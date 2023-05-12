'use client';

import { createContext, useEffect, useState, useContext } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [address, setAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);

return(
    <DataContext.Provider value={{ address, setAddress, isConnected, setIsConnected }}>
        {children}
    </DataContext.Provider>
);
}


