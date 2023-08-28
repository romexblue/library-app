import { useContext, lazy } from 'react';
import { Route, } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './AuthContext';

const Login = lazy(() => import('../Pages/Login'))

const ProtectedRoute = async ({ path, element }) => {
    const authContext = useContext(AuthContext);

    let result;
    if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
        await axios.get(`${process.env.REACT_APP_API_URL}/auth/allow`, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        })
            .then((response) => {
                if (response.data.error) {
                    authContext.logout()
                    result = <Route path="/" element={<Login />} />
                } else {
                    authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                    result = <Route path={path} element={element} />
                }
            })
    } else {
        result = <Route path="/" element={<Login />} />;
    }

    return result;
};

export default ProtectedRoute;