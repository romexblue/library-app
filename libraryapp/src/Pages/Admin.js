import '../styles/Admin.css';
import { useEffect, useContext, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../helpers/AuthContext";
import AdminFloor from './AdminFloor';
import AdminReservation from './AdminReservation';
import AdminConfab from './AdminConfab';
import AdminStudent from './AdminStudent';
import AdminUsers from './AdminUsers';

const Admin = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [activeComponent, setActiveComponent] = useState('AdminReservation');

    const handleNavClick = (component) => {
        setActiveComponent(component);
    }

    useEffect(() => {
        //to check token then check if admin
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
            axios.get("http://localhost:5000/auth/allow", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        authContext.logout();
                        navigate('/');
                    } else {
                        authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                        axios.get(`http://localhost:5000/auth/admin-auth/${sessionStorage.getItem("id")}`, {
                            headers: {
                                accessToken: sessionStorage.getItem("accessToken"),
                                userId: sessionStorage.getItem("id")
                            },
                        }).then((response) => {
                            if (response.data.error) {
                                //if not admin
                                navigate('/choose')
                            } else {
                                //if admin
                                navigate('/admin')
                            }
                        })

                    }
                })
        } else {
            if (!sessionStorage.getItem("accessToken") && !sessionStorage.getItem("id")) {
                navigate('/')
            }
        }

    }, [authContext, navigate]);

    return (
        <div>
            <h5> Hello Admin</h5>

            <nav>
                <ul>
                    <li onClick={() => handleNavClick('AdminReservation')}>Reservations</li>
                    <li onClick={() => handleNavClick('AdminFloor')}>Floor Plan</li>
                    <li onClick={() => handleNavClick('AdminConfab')}>Confab Plan</li>
                    <li onClick={() => handleNavClick('AdminStudent')}>Student List</li>
                    <li onClick={() => handleNavClick('AdminUsers')}>Users List</li>
                </ul>
            </nav>
            <div>
                {activeComponent === 'AdminReservation' && <AdminReservation />}
                {activeComponent === 'AdminFloor' && <AdminFloor />}
                {activeComponent === 'AdminConfab' && <AdminConfab />}
                {activeComponent === 'AdminStudent' && <AdminStudent />}
                {activeComponent === 'AdminUsers' && <AdminUsers />}
            </div>
        </div>
    );
}

export default Admin