import '../styles/Admin.css';
import { useEffect, useContext, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../helpers/AuthContext";
import AEFModal from "./AEFModal";
import Stats from './Stats'
import AdminFloor from './AdminFloor';
import AdminReservation from './AdminReservation';

const Admin = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [floors, setFloors] = useState([]);
    const [floorData, setFloorData] = useState({});
    const [hoveredRow, setHoveredRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [action, setAction] = useState('Delete');
    const [isVisible, setIsVisible] = useState(false);
    const [activeComponent, setActiveComponent] = useState('AdminFloor'); // initialize with 'Stats' as the default active component

    const handleNavClick = (component) => {
      setActiveComponent(component);
    }
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
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

    const serverReq = () => {
        axios.get("http://localhost:5000/floor/all", {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        })
            .then(response => {
                setFloors(response.data);
            })
            .catch(error => {
            });
    };

    //query database if correct user
    useEffect(() => {
        serverReq();
    }, []);

    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handleClick = (floor, type) => {
        if (type === "Delete") {
            axios.delete(`http://localhost:5000/floor/${floor.id}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then(response => {
                    serverReq();
                })
                .catch(error => {
                });
        }
        if (type === "Add") {
            setFloorData([]);
            setAction(type);
            setShowEditModal(true);

        }
        if (type === "Edit") {
            setFloorData(floor);
            setAction(type);
            setShowEditModal(true);
        }
    };

    const handleConfirmFloor = () => {
        setFloorData({});
        setShowEditModal(false);
    };

    const handleCancelFloor = () => {
        setShowEditModal(false);
        setAction('');
    };

    return (
        <div>
            <h5> Hello Admin</h5>
           
            <nav>
                <ul>
                    <li onClick={() => handleNavClick('AdminReservation')}>Reservations</li>
                    <li onClick={() => handleNavClick('AdminFloor')}>Floor Plan</li>
                </ul>
            </nav>
            <div>
                {activeComponent === 'AdminReservation' && <AdminReservation />}
                {activeComponent === 'AdminFloor' && <AdminFloor />}
            </div>
        </div>
    );
}

export default Admin