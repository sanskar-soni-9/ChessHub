import React, { createContext, useEffect, useState } from 'react'
import Cookie from 'js-cookie'
export const UserDataContext = createContext();


const UserDataContextProvider = ({ children }) => {
    // TODO: use more secure mechanism insted of localstorage
    const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    async function fetchUserDetails() {
        try {
            if (isLoggedIn) {
                let { id: userid } = JSON.parse(localStorage.getItem('user'));
                let userDetailsUrl = `${import.meta.env.VITE_BACKEND_HOST}/api/user/${userid}`
                const response = await fetch(userDetailsUrl, {
                    credentials: 'include'
                });
                const resData = await response.json();
                if (response.ok) {
                    setUser(resData);
                } else {
                    console.log(resData.devMessage);
                    setErrorMessage(resData.userMessage);
                }
            }
        } catch (err) {
            setErrorMessage("Something went wrong");
        }
    }

    useEffect(() => {
        fetchUserDetails()
    }, []);

    return (
        <UserDataContext.Provider value={{ user, errorMessage, isLoggedIn,setIsLoggedIn }}>
            {children}
        </UserDataContext.Provider>
    )
}


export default UserDataContextProvider