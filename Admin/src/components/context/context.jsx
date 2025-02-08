import { createContext, useState, useContext, useEffect, Children } from 'react';
import { jwtDecode } from 'jwt-decode';

export const storeContext = createContext()

const storeContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [auth, setAuth] = useState(null)
    const [loading,setloading] = useState(true)
    const currency = "₹"
    // login logic
    const handleToLogin = (token) => {
        if (!token) return
        localStorage.setItem("AuthToken", token)
       
        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            
      setAuth({
        id: decodedToken._id,
        name: decodedToken.name,
        profile: decodedToken.profileURL,
        role:decodedToken.role
      });
         setIsAuthenticated(true)
            
        } catch (error) {
            console.log(error);
        }
    }


    // save auth details
    useEffect(() => {
        const token = localStorage.getItem("AuthToken")
        if (token) {
            try {
                const decodedToken = jwtDecode(token)
            setAuth({
                id:decodedToken._id,
                name:decodedToken.name,
                profile:decodedToken.profileURL,
                role : decodedToken.role
            })
            setIsAuthenticated(true)
            } catch (error) {
                console.log(error);
                localStorage.removeItem("AuthToken")
                
            }
        }

        setloading(false)
    }, [])

console.log("auth",auth);


    // handle to logout
    const handleToLogout = () => {
        localStorage.removeItem("AuthToken")
        setIsAuthenticated(false);
        setAuth(null)
    }


    const contextValue = { currency, handleToLogin, handleToLogout, isAuthenticated,auth }

    return (
        <storeContext.Provider value={contextValue}>
            {children}
        </storeContext.Provider>
    )
}


export default storeContextProvider