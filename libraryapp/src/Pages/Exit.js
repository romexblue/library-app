import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image1 from "../images/Back_Icon.png";
import image2 from "../images/Rfid_Icon.png";
import image3 from "../images/XuLib.png";
import image4 from "../images/Xentry_Banner.png";

import "../styles/InfoPage.css";

const Exit = () => {
    const [response, setResponse] = useState("");
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [date, setDate] = useState(new Date());
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            checkFocus();
            setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function checkFocus() {
        if (document.activeElement === document.body) {
            inputRef.current.focus();
        }
    }

    function handleChange(event) {
        setResponse("");
        setValue(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const studentID = value;
        const today = new Date();
        const formattedTime = today.toLocaleTimeString("en-US", {
            hour12: false,
        });
        const data = { time_out: formattedTime };
        try {
            if (studentID.trim() !== "") {
                //handle blank space when deleting all
                const encodedValue = encodeURIComponent(studentID.trim()); //handle special chars to prevent error
                axios
                    .patch(
                        `${process.env.REACT_APP_API_URL}/record/find/${encodedValue}`,
                        data,
                        {
                            headers: {
                                accessToken:
                                    sessionStorage.getItem("accessToken"),
                                userId: sessionStorage.getItem("id"),
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.error) {
                            setResponse(response.data.error);
                            setValue("");
                        } else {
                            setResponse(response.data.success);
                            setValue("");
                        }
                        setIsDisabled(true);
                        setTimeout(() => {
                            setResponse("");
                            setIsDisabled(false);
                        }, 300);
                    });
            } else {
                setValue("");
            }
        } catch (error) {}
    }
    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
        });
    };
    return (
        <div className="Sections">
            <div className="sec1">
                <div className="Back" onClick={() => navigate("/choose")}>
                    <button className="back-icon">
                        <img
                            className="BackIcon"
                            id="BackBtn"
                            src={image1}
                            alt="img"
                        />
                        <p></p>
                    </button>
                </div>
                <div className="systemName">
                    {" "}
                    <img src={image4} alt=""></img>
                </div>
            </div>
            <div className="sec2">
                <div className="RFID-Icon">
                    <img src={image2} alt="img" />
                </div>
                <div className="TapMessage">
                    <h1>TAP YOUR ID TO EXIT</h1>
                </div>
            </div>
            <div className="sec3">
                <form onSubmit={handleSubmit}>
                    <div className="IdInput">
                        <label htmlFor="fname">Library User</label>
                        <input
                            type="text"
                            disabled={isDisabled}
                            ref={inputRef}
                            id="fname"
                            placeholder="Tap Your ID"
                            value={value}
                            onChange={handleChange}
                            style={{
                                borderColor:
                                    response === "Not Timed In" ||
                                    response === "No existing record"
                                        ? "red"
                                        : "",
                                backgroundColor:
                                    response === "Not Timed In" ||
                                    response === "No existing record"
                                        ? "rgb(255, 251, 251)"
                                        : "",
                            }}
                        />
                    </div>
                </form>
            </div>
            <div className="sec4">
                <div className="LibrarySeal">
                    <img src={image3} alt="img" />
                </div>
                <div className="centerText">
                    <div className="feedbackContainer">
                        <p className="feedback">
                            <span
                                style={{
                                    color:
                                        response === "Time Out Successful"
                                            ? "#385DBB"
                                            : "",
                                }}
                            >
                                {response}
                            </span>
                        </p>
                    </div>
                    <div className="rightsText">
                        <p>
                            Developed by M. Chiong, K. Sobiono, & G. Tahud 2023
                            of CCS-BSIT 4. All rights reserved.
                        </p>
                    </div>
                </div>
                <div className="systemtime">
                    <div className="display-date">
                        <span id="month">{formatDate(date)}</span>
                    </div>
                    <div className="display-time">{formatTime(date)}</div>
                </div>
            </div>
        </div>
    );
};

export default Exit;
