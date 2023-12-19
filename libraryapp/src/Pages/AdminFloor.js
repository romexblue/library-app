import flo from "../styles/AdminFloor.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AEFModal from "./AEFModal";
import DeleteModal from "./DeleteModal";
import image2 from "../images/Edit_Icon.png";
import image3 from "../images/Delete_Icon.png";

const AdminFloor = () => {
    const [floors, setFloors] = useState([]);
    const [floorData, setFloorData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [action, setAction] = useState("Delete");

    const serverReq = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/floor/all`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                setFloors(response.data);
            })
            .catch((error) => {});
    };
    useEffect(() => {
        serverReq();
    }, []);

    const handleClick = (floor, type) => {
        if (type === "Delete") {
            setFloorData(floor);
            setAction(type);
            setShowDeleteModal(true);
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
        setAction("");
    };

    const handleDeleteConfirm = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/floor/${floorData.id}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                serverReq();
            })
            .catch((error) => {});
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setFloorData({});
        setAction("");
    };

    return (
        <div className={flo.floorPage}>
            <div className={flo.pageHeader}>
                <div className={flo.section1}>
                    <p>Floor</p>
                </div>
                <div className={flo.section2}></div>
                <div className={flo.section3}>
                    <div className={flo.button1}>
                        <button
                            className={flo.addBtn}
                            onClick={() => handleClick([], "Add")}
                        >
                            <div className={flo.plusSign}>+</div>
                            <p>Add Floor</p>
                        </button>
                    </div>
                </div>
            </div>
            <table className={flo.tableContainer}>
                <thead className={flo.tableHeader}>
                    <tr>
                        <th>Level</th>
                        <th>Name</th>
                        <th>Current Count</th>
                        <th>Capacity</th>
                        <th>Building No.</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className={flo.tableContent}>
                    {floors.map((floor, index) => (
                        <tr key={floor.id}>
                            <td>{floor.level}</td>
                            <td>{floor.name}</td>
                            <td>{floor.current_count}</td>
                            <td>{floor.max_capacity}</td>
                            <td>{floor.label}</td>
                            <td>{floor.status}</td>
                            <td>
                                <button
                                    className={flo.editButton}
                                    onClick={() => handleClick(floor, "Edit")}
                                >
                                    <img src={image2} alt=""></img>
                                </button>
                                <button
                                    className={flo.deleteButton}
                                    onClick={() => handleClick(floor, "Delete")}
                                >
                                    <img src={image3} alt=""></img>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
            {showDeleteModal && (
                <DeleteModal
                    title={action.toLocaleLowerCase()}
                    message={`${floorData.name}`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default AdminFloor;
