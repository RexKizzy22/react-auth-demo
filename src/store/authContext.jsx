import { createContext, useCallback, useEffect, useState } from "react";

let logOutTimer;

const AuthContext = createContext({
    token: "",
    isLoggedIn: false,
    login: (token, expirationTime) => {},
    logout: () => {}
});

const calculateExpirationTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const expiresIn = new Date(expirationTime).getTime();

    const timeLeft = expiresIn - currentTime;
    return timeLeft;
}

const retrieveStoredVars = () => {
    const storedToken = localStorage.getItem("token");
    const storedExpirationTime = localStorage.getItem("expirationTime");
    const remainingTime = calculateExpirationTime(storedExpirationTime);

    if (remainingTime <= 120000) {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        return null;
    }

    return {
      token: storedToken,
      duration: remainingTime
    };
};

export const AuthProvider = ({children}) => {
    const tokenData = retrieveStoredVars();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }
    const [token, setToken] = useState(initialToken);

    const isLoggedIn = !!token;
    
    const logOut = useCallback(() => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");

        if (logOutTimer) {
            clearTimeout(logOutTimer);
        }
    }, []);
    
    const login = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationTime", expirationTime);

        const currentExpirationTime = calculateExpirationTime(expirationTime);
        logOutTimer = setTimeout(logOut, currentExpirationTime);
    };

    useEffect(() => {
        if (tokenData) {
            logOutTimer = setTimeout(logOut, tokenData.duration);
        }
    }, [tokenData]);

    const value = {
        token,
        isLoggedIn,
        login,
        logOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;