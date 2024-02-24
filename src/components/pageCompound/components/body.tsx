import React, {
    // ReactElement, 
    // isValidElement, 
    createContext,
    useContext,
    useState
} from "react";
import TableCompound from "../../tableCompound/tableCompound";
// import TableCompound from "../../tableCompound/tableCompound";


/** 
 * * PAGECOMPOUND_BODY
**/

type BodyTypes = {
    bodyState1: string,
    setBodyState1: React.Dispatch<React.SetStateAction<string>>
    setBodyVariables: <T>(args: T) => void
}

const BodyPageCompoundContext = createContext({} as BodyTypes);
export function useBodyPageCompoundContext()
{
    return useContext(BodyPageCompoundContext);
}

const Body = ({ children }: { children?: React.ReactNode }) =>
{
    const [bodyState1, setBodyState1] = useState("");

    function setBodyVariables<T>(args: T)
    {
        console.log(args);
    }
  
    return (
        <BodyPageCompoundContext.Provider value={{ bodyState1, setBodyState1, setBodyVariables }}>
            {children && children}
            {!children && <>
                <TableCompound>
                    <TableCompound.Header />
                    <TableCompound.Body filter={(_item) => _item.age !== 22} />
                    <TableCompound.Footer />
                </TableCompound>
            </>}
        </BodyPageCompoundContext.Provider>
    )
}

export default Body