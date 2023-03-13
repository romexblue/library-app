import '../styles/InfoPage.css'
import { useState, useEffect } from "react";
import axios from "axios";

const InfoPage = ({studentID, setStudentID, studentRFID, setStudentRFID, inputRef}) => {
    const [value, setValue] = useState(''); //value of input
    const [searchResult, setSearchResult] = useState(''); //value of result
    const [userData, setUserData] = useState([]);
    
    useEffect(()=>{
        if(!studentRFID && !studentID){
            setValue('');
            setSearchResult('')
            setUserData([]);
        }
    },[studentID, studentRFID]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        try {
            if (newValue.trim() !== '') { //handle blank space when deleting all
                const encodedValue = encodeURIComponent(newValue.trim()); //handle special chars to prevent error
                axios.get(`http://localhost:5000/student/find/${encodedValue}`, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id")
                    },
                })
                    .then((response) => {
                        if (response.data.error) {
                            setSearchResult('User Not Found');
                            setUserData([]);
                            setStudentID('');
                            setStudentRFID('');
                        } else {
                            setSearchResult('User Found');
                            setUserData(response.data);
                            setStudentID(response.data.id);
                            setStudentRFID(response.data.rfid);
                        }
                    })
            } else {
                setSearchResult('');
                setStudentID('');
                setStudentRFID('');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <label htmlFor="textInput">Scan School ID:</label>
            <input
                type="text"
                id="textInput"
                ref={inputRef}
                value={value}
                onChange={handleChange}
            />
            <p>{searchResult}</p>
            <p>Name:{userData.name}</p>
            <p>Course:{userData.course}</p>
            <p>Year:{userData.year}</p>
        </div>
    )
}

export default InfoPage