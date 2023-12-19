import '../styles/Admin.css';
import { useEffect, useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import AuthContext from "../helpers/AuthContext";
import AdminFloor from './AdminFloor';
import AdminReservation from './AdminReservation';
import AdminConfab from './AdminConfab';
import AdminStudent from './AdminStudent';
import AdminUsers from './AdminUsers';
import AdminStatistics from './AdminStatistics';
import image1 from '../images/Logout_Icon.png';
import image2 from '../images/Options_Icon.png';
import image3 from '../images/Xentry_Icon.png';

const Admin = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [activeComponent, setActiveComponent] = useState('AdminReservation');
    //const location = useLocation();
    const [date, setDate] = useState(new Date());

    const { userName: adminName, userType: isAdmin } = authContext || {};

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
        const timer = setInterval(() => {
            setDate(new Date())
        }, 1000);
        return () => clearInterval(timer);

    }, []);

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
                        {(isAdmin === "Admin" || isAdmin === "Librarian" || isAdmin === "Assistant") && (
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

                                            className={activeComponent === 'AdminStatistics' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminStatistics')} id='button2'>
                                            Statistics
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className='sideButton' id='btn5'>
                                        <button
                                            className={activeComponent === 'AdminStudent' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminStudent')} id='button5'>
                                            Patrons
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                        {isAdmin === "Admin" && (
                            <>
                                <li>
                                    <div className='sideButton' id='btn3'>
                                        <button

                                            className={activeComponent === 'AdminFloor' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminFloor')} id='button3'>
                                            Floor Manager
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className='sideButton' id='btn4'>
                                        <button

                                            className={activeComponent === 'AdminConfab' ? 'active' : 'buttonColor'}


                                            onClick={() => handleTabClick('AdminConfab')} id='button4'>
                                            Space Manager
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className='sideButton' id='btn6'>
                                        <button

                                            className={activeComponent === 'AdminUsers' ? 'active' : 'buttonColor'}

                                            onClick={() => handleTabClick('AdminUsers')} id='button6'>
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
                    <div className='section' id='navbarPart1'>

                    </div>
                    <div className='section' id='navbarPart2'>
                        <img alt='' src={image3} />
                    </div>
                    <div className='section' id='navbarPart3'>
                        <button className='buttons' id='adminOptions' onClick={() => navigate('/choose')}><img src={image2} alt=""></img></button>
                        <button className='buttons' id='adminlogoutBtn' onClick={() => authContext.logout()}><img src={image1} alt=""></img></button>
                    </div>
                </div>
                <div className='page-window'>

                    <div className='pages'>
                        {activeComponent === 'AdminReservation' && (
                            <div>
                                <AdminReservation />
                            </div>
                        )}
                        {activeComponent === 'AdminStatistics' && (
                            <div>
                                <AdminStatistics />
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
                                <AdminStudent adminData={{ type: isAdmin, name: adminName }} />
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