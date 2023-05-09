import '../styles/Admin.css';
import { useEffect, useContext, useState } from "react"
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const [date, setDate] = useState(new Date());
    const [adminName, setAdminName] = useState((location.state || {}).name);
    const [isAdmin, setIsAdmin] = useState((location.state || {}).userType);
    
    const handleTabClick = (component) => {
        setActiveComponent(component);
    };
    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });
    };
    useEffect(() => {
        //to check token then check if admin
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
            axios.get(`http://localhost:5000/auth/admin-auth/${sessionStorage.getItem("id")}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            }).then((response) => {
                if (response.data.error) {
                    //if not admin
                    authContext.logout();
                    navigate('/');
                } else {

                    //if admin
                    if (response.data.type === "Admin" || response.data.type === "Librarian" || response.data.type === "Assistant") {
                        navigate('/admin');
                        setAdminName(response.data.name);
                        setIsAdmin(response.data.type);
                    } else {
                        navigate('/choose') // for guard 
                    }
                    authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                }

            })
        } else {
            if (!sessionStorage.getItem("accessToken") && !sessionStorage.getItem("id")) {
                navigate('/')
            }
        }
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000);
        return () => clearInterval(timer);

    }, [authContext, navigate]);

    return (

        <div className="main">
            <div className="sidebar">
                <div className='section' id='accountInfo'>
                    <div className='systemUser' id='userTag'>
                        {adminName}
                    </div>
                </div>
                <div className='section' id='boundary'>

                </div>
                <div className='section' id='dashBtns'>
                    <ul>
                        {(isAdmin === "Admin" || isAdmin === "Librarian" || isAdmin === "Assistant")  && (
                            <>
                                <li>
                                    <div className='sideButton' id='btn1'>
                                        <button
                                            className={activeComponent === 'AdminReservation' ? 'active' : 'buttonColor'}
                                            onClick={() => handleTabClick('AdminReservation')} id='button1' >
                                            Reservations
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                        {(isAdmin === "Admin" || isAdmin === "Librarian") && (
                            <>
                                <li>
                                    <div className='sideButton' id='btn2'>
                                        <button

                                            className={activeComponent === 'AdminFloor' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminFloor')} id='button2'>
                                            Floor Manager
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className='sideButton' id='btn3'>
                                        <button

                                            className={activeComponent === 'AdminConfab' ? 'active' : 'buttonColor'}


                                            onClick={() => handleTabClick('AdminConfab')} id='button3'>
                                            Space Manager
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className='sideButton' id='btn4'>
                                        <button
                                            className={activeComponent === 'AdminStudent' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminStudent')} id='button4'>
                                            Patrons
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                        {isAdmin === "Admin"&& (
                            <>
                                <li>
                                    <div className='sideButton' id='btn5'>
                                        <button

                                            className={activeComponent === 'AdminUsers' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminUsers')} id='button5'>
                                            Users
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <div className='section' id='boundary'>

                </div>
                <div className='section' id='sTime'>
                    <div className='comp' id='timeDiv'>
                        <div className='comp' id='timeContainer'>
                            <div className='dateData' id='dateD'>{formatDate(date)}</div>
                            <div className='dateData' id='timeDivider'> | </div>
                            <div className='dateData' id='timeD'> {formatTime(date)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pagecontainer">
                <div className="navbar">
                    <div className='systemName' id='sysname'>
                        XU-Lib Sentry
                    </div>
                </div>
                <div className='page-window'>

                    <div className='pages'>
                        {activeComponent === 'AdminReservation' && (
                            <div>
                                <AdminReservation />
                            </div>
                        )}
                        {activeComponent === 'AdminFloor' && (
                            <div>
                                <AdminFloor />
                            </div>
                        )}
                        {activeComponent === 'AdminConfab' && (
                            <div>
                                <AdminConfab />
                            </div>
                        )}
                        {activeComponent === 'AdminStudent' && (
                            <div>
                                <AdminStudent adminData={{type: isAdmin, name: adminName}}/>
                            </div>
                        )}
                        {activeComponent === 'AdminUsers' && (
                            <div>
                                <AdminUsers />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin