import { useContext, lazy, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './AuthContext';

const Login = lazy(() => import('../Pages/Login'))

const ProtectedRoute = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [isAllowed, setIsAllowed] = useState(false);

        const checkAuth = async () => {
            if (
                sessionStorage.getItem("accessToken") &&
                sessionStorage.getItem("id") &&
                !authContext.isLoggedIn
            ) {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/auth/allow`,
                        {
                            headers: {
                                accessToken: sessionStorage.getItem("accessToken"),
                                userId: sessionStorage.getItem("id"),
                            },
                        }
                    );
                    if (response.data.error) {
                        authContext.logout();
                    } else {
                        authContext.login(
                            sessionStorage.getItem("id"),
                            sessionStorage.getItem("accessToken")
                        );
                        setIsAllowed(true);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setIsAllowed(true);
            }
        };
        console.log("haha")
        checkAuth();
   

    return isAllowed ? children : <Navigate to={"/"} replace />;
};

export default ProtectedRoute;