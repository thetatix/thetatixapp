'use client';

import { createContext, useEffect, useState, useContext } from "react";

export const DataContext = createContext(null);

// export const addressFixed = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

 
export const DataProvider = ({ children }) => {
    const [address, setAddress] = useState('');
    // const [isConnected, setIsConnected] = useState(false);

return(
    <DataContext.Provider value={{ address, setAddress }}>
        {children}
    </DataContext.Provider>
);
}


