import { createContext, useState } from "react";

export const DataContent = createContext();

function DataProvider({ children }) {
    const [user, setUser] = useState('James');
    const [num, setNum] = useState(0);

    return (
        <DataContent.Provider value={{ num, user, setNum, setUser }}>
            {children}
        </DataContent.Provider>
    )
}


export default DataProvider;
