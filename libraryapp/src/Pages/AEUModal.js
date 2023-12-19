import aeu from "../styles/ModalAEU.module.css";
import React, { useState } from "react";
import axios from "axios";
import icon1 from "../images/hide.png";
import icon2 from "../images/unhide.png";

const UserModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [username, setUserName] = useState(data.username ?? "");
    const [type, setType] = useState(data.type ?? "Librarian");
    const [password, setPassword] = useState(data.password ?? "");
    const [showModal, setShowModal] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [buttonImg, setButtonImg] = useState(icon1);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = {
                name: name,
                username: username,
                type: type,
                password: password,
            };
            axios
                .patch(
                    `${process.env.REACT_APP_API_URL}/auth/${data.id}`,
                    dataChanged,
                    {
                        headers: {
                            accessToken: sessionStorage.getItem("accessToken"),
                            userId: sessionStorage.getItem("id"),
                        },
                    }
                )
                .then((response) => {
                    if (response.data.error) {
                        //pass
                    } else {
                        updateUi(1);
                    }
                });
        }
        if (action === "Add") {
            const dataAdd = {
                name: name,
                username: username,
                type: type,
                password: password,
            };
            axios
                .post(`${process.env.REACT_APP_API_URL}/auth`, dataAdd, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id"),
                    },
                })
                .then((response) => {
                    if (response.data.error) {
                        //pass
                    } else {
                        updateUi(1);
                    }
                });
        }
        setName("");
        setUserName("");
        setType("");
        setPassword("");
        update();
    };

    const handleCancel = () => {
        cancel();
        setShowModal(false);
    };

    const handleMouseDown = () => {
        setShowPassword(true);
        setButtonImg(icon2);
    };

    const handleMouseUp = () => {
        setShowPassword(false);
        setButtonImg(icon1);
    };

    function generatePassword() {
        const length = 12;
        let pswd = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            pswd += characters[randomIndex];
        }

        setPassword(pswd);
    }

    return (
        showModal && (
            <div className={aeu.modal}>
                <div className={aeu.modalContent}>
                    <div className={aeu.modalHeader}>
                        <p className={aeu.modalTitle}>{title}</p>
                        <div className={aeu.modalClose} onClick={handleCancel}>
                            x
                        </div>
                    </div>
                    <div className={aeu.modalBody}>
                        <div className={aeu.section1}>
                            <div className={aeu.comp1}>
                                <p className={aeu.secLabel1}>Name:</p>
                            </div>
                            <div className={aeu.comp2}>
                                <input
                                    className={aeu.secInput1}
                                    type="text"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={aeu.section2}>
                            <div className={aeu.comp1}>
                                <p className={aeu.secLabel2}>Username:</p>
                            </div>
                            <div className={aeu.comp2}>
                                <input
                                    className={aeu.secInput2}
                                    type="text"
                                    value={username}
                                    onChange={(event) => {
                                        setUserName(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={aeu.section3}>
                            <div className={aeu.comp1}>
                                <p className={aeu.secLabel3}>Type:</p>
                            </div>
                            <div className={aeu.comp2}>
                                <select
                                    className={aeu.secType3}
                                    value={type}
                                    onChange={(event) =>
                                        setType(event.target.value)
                                    }
                                >
                                    <option value="Admin"> Admin</option>
                                    <option value="Librarian">
                                        {" "}
                                        Librarian
                                    </option>
                                    <option value="Assistant">
                                        {" "}
                                        Assistant
                                    </option>
                                    <option value="Guard"> Guard </option>
                                </select>
                            </div>
                        </div>
                        <div className={aeu.section4}>
                            <div className={aeu.comp1}>
                                <p className={aeu.secLabel4}>Password </p>
                            </div>
                            <div className={aeu.comp2a}>
                                <div className={aeu.passMaker}>
                                    <input
                                        className={aeu.secInput4}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                    />
                                    <button
                                        className={aeu.visiButton}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                    >
                                        <img
                                            src={buttonImg}
                                            alt="Toggle Button"
                                        />
                                    </button>
                                </div>
                                <button
                                    className={aeu.passGenerate}
                                    onClick={() => generatePassword()}
                                >
                                    Generate Password
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={aeu.modalFooter}>
                        <button
                            className={aeu.cancelBtn}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className={aeu.confirmBtn}
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UserModal;
