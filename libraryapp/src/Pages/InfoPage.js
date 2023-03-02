import '../styles/InfoPage.css'
import { useState } from "react";
import axios from "axios";

const InfoPage = ({setStudentID}) => {
    const [value, setValue] = useState(''); //value of input
    const [searchResult, setSearchResult] = useState(''); //value of result
    const [userData, setUserData] = useState([]);
    
    const handleChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        try {
            if (newValue.trim() !== '') { //handle blank space when deleting all
                const encodedValue = encodeURIComponent(newValue.trim()); //handle special chars to prevent error
                axios.get(`http://localhost:5000/student/find/${encodedValue}`, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                })
                    .then((response) => {
                        if (response.data.error) {
                            setSearchResult('User Not Found');
                            setUserData([]);
                            setStudentID('')
                        } else {
                            setSearchResult('User Found');
                            setUserData(response.data);
                            setStudentID(response.data.id)
                        }
                    })
            } else {
                setSearchResult('');
                setStudentID('')
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <label htmlFor="textInput">Enter School ID:</label>
            <input
                type="number"
                id="textInput"
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