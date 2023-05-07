import aef from '../styles/ModalAEF.module.css'
import React, { useState } from "react";
import axios from 'axios';

const FloorModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [maxCapacity, setMaxCapacity] = useState(data.max_capacity ?? 0);
    const [status, setStatus] = useState(data.status ?? "Open");
    const [level, setLevel] = useState(data.level ?? 0);
    const [bldg, setBldg] = useState(data.bldg ?? "Bldg1")
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, max_capacity: maxCapacity, level:level, label:bldg, status: status };
            axios.patch(`http://localhost:5000/floor/${data.id}`, dataChanged, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        //pass
                    } else {
                        updateUi();
                    }
                });
        }
        if (action === "Add") {
            const dataAdd = { name: name, current_count: 0, max_capacity: maxCapacity, level:level, label:bldg, status: status };
            axios.post("http://localhost:5000/floor/", dataAdd, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        //pass 
                    } else {
                        updateUi();
                    }
                });
        }
        setName('');
        setMaxCapacity('');
        setStatus('Open');
        setShowModal(false);
        update();
    };

    const handleCancel = () => {
        cancel();
        setShowModal(false);
    };

    return (
        showModal && (
            <div className={aef.confModal}>
                <div className={aef.modalContent}>
                    <div className={aef.modalHeader}>
                        <p className={aef.modalTitle}>{title}</p>
                        <div className={aef.modalClose} onClick={handleCancel}>x</div>
                    </div>
                    <div className={aef.modalBody}>
                        <div className={aef.nameSection} >
                            <label className={aef.nameLabel}>Name:</label>
                            <input className={aef.nameInput} type="text" placeholder='Floor #' value={name} onChange={(event) => { setName(event.target.value) }} />
                            <div className={aef.nameHint}>Set the floor level/number using figure</div></div>
                        <div className={aef.capacitySection} >
                            <label className={aef.capacityLabel}>Max Capacity:</label>
                            <input className={aef.capacityInput} type="number" value={maxCapacity} onChange={(event) => { setMaxCapacity(event.target.value) }} /></div>
                        <div className={aef.levelSection} >
                            <label className={aef.levelLabel}>Level:</label>
                            <input className={aef.levelInput}type="number" value={level} onChange={(event) => { setLevel(event.target.value) }} />
                            <div className={aef.nameHint}>Set the floor level/number based on the floor name.</div>
                            </div>
                        <div className={aef.buildingSection} >
                            <label className={aef.buildingLabel}>Building No.:</label>
                            <select className={aef.buildingInput} value={bldg} onChange={(event) => setBldg(event.target.value)}>
                                <option value="Bldg1"> 1</option>
                                <option value="Bldg2"> 2</option>
                            </select>
                        </div>
                        <p className={aef.statusSection}>
                            <label className={aef.statusLabel}>Status:</label>
                            <select className={aef.statusInput} value={status} onChange={(event) => setStatus(event.target.value)}>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </p>
                    </div>
                    <div className={aef.modalFooter}>
                        <button className={aef.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button className={aef.confirmBtn} onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default FloorModal;
