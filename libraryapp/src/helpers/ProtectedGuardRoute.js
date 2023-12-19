import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './AuthContext';
import Loading from '../components/Loading/Loading';

const ProtectedGuardRoute = () => {
    const authContext = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
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
                    }
                } catch (error) {
                    console.error(error);
                    authContext.logout();
                }
            }
            setIsLoading(false);
        };

        checkAuthentication();
    }, [authContext]);

    if (isLoading) {
        return <Loading />;
    }

    return authContext.isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedGuardRoute;