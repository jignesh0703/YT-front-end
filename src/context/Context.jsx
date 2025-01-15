import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const Context = (props) => {

    const [isLoggedin, setisLoggedin] = useState(false)
    const [data, setdata] = useState(null)

    const URL = 'http://localhost:3000'

    const checkLogin = useCallback(async () => {
        try {
            const response = await axios.get(`${URL}/api/user/getdetail`, { withCredentials: true });
            if (response && response.status === 200) {
                setisLoggedin(true);
                setdata(response.data.user);
            } else {
                setisLoggedin(false);
                setdata(null);
            }
        } catch (error) {
            setisLoggedin(false);
            setdata(null);
        }
    }, [URL]);

    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    const ContextValue = {
        URL,
        isLoggedin,
        data,
        checkLogin
    }

    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default Context