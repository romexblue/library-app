import flo from '../styles/AdminFloor.module.css';
import { useEffect, useState } from 'react'
import axios from 'axios';
import AEFModal from './AEFModal'

const AdminFloor = () => {
    const [floors, setFloors] = useState([]);
    const [floorData, setFloorData] = useState({});
    const [hoveredRow, setHoveredRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [action, setAction] = useState('Delete');

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
    useEffect(() => {
        serverReq();
    },[])

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
            <table>
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Name</th>
                        <th>Current Count</th>
                        <th>Capacity</th>
                        <th>Building No.</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {floors.map((floor, index) => (
                        <tr
                            key={floor.id}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <td>{floor.level}</td>
                            <td>{floor.name}</td>
                            <td>{floor.current_count}</td>
                            <td>{floor.max_capacity}</td>
                            <td>{floor.label}</td>
                            <td>{floor.status}</td>
                            <td style={{ border: 'none' }}>
                                {hoveredRow === index && (
                                    <>
                                        <button onClick={() => handleClick(floor, "Edit")}>Edit</button>
                                        <button onClick={() => handleClick(floor, "Delete")}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => handleClick([], "Add")}>Add Floors</button>
            {showEditModal && (
                <AEFModal
                    title={`${action} Floor`}
                    data={floorData}
                    update={handleConfirmFloor}
                    cancel={handleCancelFloor}
                    updateUi={serverReq}
                    action={action}
                />
            )}
        </div>
    )
}

export default AdminFloor