import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import AuthContext from "./AuthContext";
import Loading from "../components/Loading/Loading";

const ProtectedAdminRoute = () => {
    const authContext = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const checkAuthentication = async () => {
            if (
                (sessionStorage.getItem("accessToken") &&
                    sessionStorage.getItem("id")) ||
                !authContext.isLoggedIn
            ) {
                try {
                    const response = await axios.get(
                        `${
                            process.env.REACT_APP_API_URL
                        }/auth/admin-auth/${sessionStorage.getItem("id")}`,
                        {
                            headers: {
                                accessToken:
                                    sessionStorage.getItem("accessToken"),
                                userId: sessionStorage.getItem("id"),
                            },
                        }
                    );

                    if (response.data.error) {
                        // If not logged in
                        authContext.logout();
                    } else {
                        // Check user type
                        const userType = response.data.type;
                        setUserType(userType);

                        authContext.login(
                            sessionStorage.getItem("id"),
                            sessionStorage.getItem("accessToken"),
                            response.data.name,
                            response.data.type
                        );

                        setIsLoading(false);
                    }
                } catch (error) {
                    authContext.logout();
                    setIsLoading(false);
                }
            } else {
                if (
                    !sessionStorage.getItem("accessToken") &&
                    !sessionStorage.getItem("id")
                ) {
                    authContext.logout();
                    setIsLoading(false);
                }
            }
        };

        checkAuthentication();
    }, [authContext]);

    if (isLoading) {
        return <Loading />;
    }

    if (authContext.isLoggedIn) {
        if (userType === "Admin") {
            return <Outlet />;
        } else if (userType === "Guard") {
            return <Navigate to="/choose" replace />;
        }
    }

    return <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
