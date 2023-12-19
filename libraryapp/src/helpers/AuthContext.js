import { createContext } from 'react';

const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    userType: null,
    userName: null,
    token: null,
});

export default AuthContext;