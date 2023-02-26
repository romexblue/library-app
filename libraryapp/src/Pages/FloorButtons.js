import '../styles/Button.css'
import axios from "axios"
import { useState, useEffect, useRef } from "react";

const FloorButtons = () => {

    const [buttonData, setButtonData] = useState([]);// array of button text values based on database data
    const buttonRefs = useRef([]);

    useEffect(() => {
        axios.get("http://localhost:5000/floor", {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
            },
        })
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error)
                } else {
                    setButtonData(response.data)
                }
            })

    }, []);

    useEffect(() => {
        buttonRefs.current[0]?.focus(); // set initial focus on first button if there are buttons
    }, [buttonData]);

    const handleKeyDown = (event, index) => {
        const buttonCount = buttonData.length;

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            buttonRefs.current[(index - 1 + buttonCount) % buttonCount].focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            buttonRefs.current[(index + 1) % buttonCount].focus();
        } else if (event.key === 'Enter') {
            event.preventDefault(); //prevents calling function twice
            console.log(`Button ${index + 1} pressed`); // handle Enter
          }
    };
    const clickHandler = (index) => {
        console.log(`Button ${index + 1} clicked`);  
    }

    return (
        <div className="button-container">
            {buttonData.map((buttonObj, index) => (
                <button
                    key={buttonObj.id}
                    className="button"
                    ref={ref => (buttonRefs.current[index] = ref)}
                    onKeyDown={event => handleKeyDown(event, index)}
                    onClick={() => clickHandler(index)}
                >
                    {buttonObj.name}
                </button>
            ))}
        </div>
    );
}

export default FloorButtons