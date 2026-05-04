import { createContext, useState } from "react";

export const DataContent = createContext();

function DataProvider({ children }) {
    const [user, setUser] = useState('James');
    const [num, setNum] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <DataContent.Provider value={{ num, user, setNum, setUser, searchQuery, setSearchQuery }}>
            {children}
        </DataContent.Provider>
    )
}


export default DataProvider;
