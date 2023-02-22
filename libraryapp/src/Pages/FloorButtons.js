import axios from "axios"
import { useState, useEffect } from "react"

const FloorButtons = () => {
    const [buttons, setButtons] = useState([]);

    useEffect(()=>{
        
    },[])

    const fetchTasks = async () => {
        const res = await axios.get()
    }

    return (
        <div>FloorButtons</div>
    )
}

export default FloorButtons