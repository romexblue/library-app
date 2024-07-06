import React, { useEffect, useState } from "react";
import InfoPage from "./InfoPage";
import ConFFModal from "./ConFFModal";
import axios from "axios";

const MedEntry = () => {
    const [studentID, setStudentID] = useState("");
    const [studentRFID, setStudentRFID] = useState("");
    const [studentData, setStudentData] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [floorID, setFloorID] = useState("");

    useEffect(() => {
        getFloors();
    }, []);

    const getFloors = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/floor/med`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {    
                setFloorID(response?.data?.id);
            });
    };

    const handleConfirm = () => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        const formattedTime = today.toLocaleTimeString("en-US", {
            hour12: false,
        });
        const data = {
            date: formattedDate,
            time_in: formattedTime,
            StudentSchoolId: studentID,
            FloorId: floorID,
            rfid: studentRFID,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/record/`, data, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                if (response.data.error) {
                } else {
                }
            });

        setStudentID("");
        setStudentRFID("");
        setShowConfirmation(false);
    };

    const handleCancel = () => {
        setStudentID("");
        setStudentRFID("");
        setStudentData([]);
        setShowConfirmation(false);
    };

    return (
        <>
            <InfoPage
                isMed
                studentID={studentID}
                setStudentID={setStudentID}
                studentRFID={studentRFID}
                setStudentRFID={setStudentRFID}
                setStudentData={setStudentData}
                onSubmitClicked={() => setShowConfirmation(true)}
            />

            {studentID && (
                <div style={{ position: "absolute", top: "0px" }}>
                    {JSON.stringify(studentData)}
                </div>
            )}

            {showConfirmation && (
                <ConFFModal
                    title="CONFIRM"
                    message={`Entering Med Library`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
};

export default MedEntry;
