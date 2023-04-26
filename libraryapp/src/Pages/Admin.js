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
    const [activeNavItem, setActiveNavItem] = useState('AdminReservation');

    const handleTabClick = (component) => {
    setActiveComponent(component);
    setActiveNavItem(component);
};

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

        <div className="main">
        <div className="sidebar">
            <div className='section' id='accountInfo'>

            </div>
            <div className='section' id='dashBtns'>
                <ul>
                    <li>
                        <div className='button' id='btn1'>
                            <button
                            className={activeNavItem === 'AdminReservation' ? 'active' : ''}
                            onClick={() => handleTabClick('AdminReservation')} id='button1' >
                            Reservations
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className='button' id='btn2'>
                            <button
                            className={activeNavItem === 'AdminFloor' ? 'active' : ''}
                            onClick={() => handleTabClick('AdminFloor')} id='button2'>
                            Floor Manager
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className='button' id='btn3'>
                            <button
                            className={activeNavItem === 'AdminConfab' ? 'active' : ''}
                            onClick={() => handleTabClick('AdminConfab')} id='button3'>
                            Space Manager
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className='button' id='btn4'>
                            <button
                            className={activeNavItem === 'AdminStudent' ? 'active' : ''}
                            onClick={() => handleTabClick('AdminStudent')} id='button4'>
                            Students
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className='button' id='btn5'>
                            <button
                            className={activeNavItem === 'AdminUsers' ? 'active' : ''}
                            onClick={() => handleTabClick('AdminUsers')} id='button5'>
                            Users
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <div className='section' id='sTime'>

            </div>
        </div>
        <div className="pagecontainer">
            <div className="navbar">

                </div>
            <div className='page-window'>
                <div className='pages'>
                    {activeComponent === 'AdminReservation' && (
                        <div>
                        <AdminReservation/>
                        </div>
                    )}
                    {activeComponent === 'AdminFloor' && (
                        <div>
                        <AdminFloor/>
                        </div>
                    )}
                    {activeComponent === 'AdminConfab' && (
                        <div>
                        <AdminConfab/>
                        </div>
                    )}
                    {activeComponent === 'AdminStudent' && (
                        <div>
                        <AdminStudent/>
                        </div>
                    )}
                    {activeComponent === 'AdminUsers' && (
                        <div>
                        <AdminUsers/>
                        </div>
                    )}
                </div>
            </div> 
        </div>
      </div>
    );
}

export default Admin