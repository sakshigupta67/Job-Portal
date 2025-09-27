import { createContext } from "react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const value ={


    }


return (<AppContext.Provider value={vlaue}>
{props.children}

</AppContext.Provider>)
    
}