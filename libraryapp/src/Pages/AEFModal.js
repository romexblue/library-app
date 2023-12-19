import aef from '../styles/ModalAEF.module.css'
import React, { useState } from "react";
import axios from 'axios';

const FloorModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [maxCapacity, setMaxCapacity] = useState(data.max_capacity ?? 0);
    const [status, setStatus] = useState(data.status ?? "Open");
    const [level, setLevel] = useState(data.level ?? 0);
    const [bldg, setBldg] = useState(data.label ?? "Annex")
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, max_capacity: maxCapacity, level:level, label:bldg, status: status };
            axios.patch(`${process.env.REACT_APP_API_URL}/floor/${data.id}`, dataChanged, {
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
            axios.post(`${process.env.REACT_APP_API_URL}/floor/`, dataAdd, {
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
                            <div className={aef.comp1}>
                            <label className={aef.nameLabel}>Name:</label>
                            </div>
                            <div className={aef.comp2}>
                            <input className={aef.nameInput} type="text" placeholder='Floor #' value={name} onChange={(event) => { setName(event.target.value) }} />
                            </div>
                            <div className={aef.comp3}>
                            <div className={aef.nameHint}>Set the floor level/number using figure</div>
                            </div>
                            </div>
                        <div className={aef.capacitySection} >
                            <div className={aef.comp1}>
                            <label className={aef.capacityLabel}>Max Capacity:</label>
                            </div>
                            <div className={aef.comp2}>
                            <input className={aef.capacityInput} type="number" value={maxCapacity} onChange={(event) => { setMaxCapacity(event.target.value) }} /></div>
                            </div>
                        <div className={aef.levelSection} >
                            <div className={aef.comp1}>
                            <label className={aef.levelLabel}>Level:</label>
                            </div>
                            <div className={aef.comp2}>
                            <input className={aef.levelInput}type="number" value={level} onChange={(event) => { setLevel(event.target.value) }} />
                            </div>
                            <div className={aef.comp4}>
                            <div className={aef.levelHint}>Set the floor level no.</div>
                            </div>
                            </div>
                        <div className={aef.buildingSection} >
                            <div className={aef.comp1}>
                            <label className={aef.buildingLabel}>Building:</label>
                            </div>
                            <div className={aef.comp2}>
                            <select className={aef.buildingInput} value={bldg} onChange={(event) => setBldg(event.target.value)}>
                                <option value="Annex"> Annex Building</option>
                                <option value="Main"> Main Building</option>
                            </select>
                            </div>
                        </div>
                        <div className={aef.statusSection}>
                            <div className={aef.comp1}>
                            <label className={aef.statusLabel}>Status:</label>
                            </div>
                            <div className={aef.comp2}>
                            <select className={aef.statusInput} value={status} onChange={(event) => setStatus(event.target.value)}>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select> 
                            </div>
                        </div>
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
