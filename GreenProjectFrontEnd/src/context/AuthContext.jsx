import React, {createContext, useContext, useEffect, useState} from 'react';


const AuthContext = createContext();
export  const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Başlangıçta false yapalım, useEffect belirlesin

    const login = (customerInfo) =>{
        localStorage.setItem("token", customerInfo.accessToken);
        localStorage.setItem("auth", "true");
        // Kullanıcı bilgisini de localStorage'a kaydedelim
        localStorage.setItem("user", JSON.stringify(customerInfo)); 
        setUser(customerInfo); // user state'ini güncelle
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // user bilgisini de sil
        localStorage.removeItem("auth");
        setUser(null); // user state'ini temizle
        setIsAuthenticated(false);
    }

    useEffect(() => {
        const authStatus = localStorage.getItem("auth") === "true";
        setIsAuthenticated(authStatus);

        if (authStatus) {
            // Eğer giriş yapılmışsa, kullanıcı bilgisini localStorage'dan al ve state'i güncelle
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }

        // Sekmeler arası senkronizasyon için storage event listener
        const handleStorageChange = (event) => {
            if (event.key === "auth") {
                const newAuthStatus = event.newValue === "true";
                setIsAuthenticated(newAuthStatus);
                if (!newAuthStatus) {
                    setUser(null);
                }
            }
            if (event.key === "user") {
                 setUser(JSON.parse(event.newValue));
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);


    return (
        <AuthContext.Provider value={{user, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);