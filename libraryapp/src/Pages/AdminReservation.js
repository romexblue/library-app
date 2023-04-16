import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReservation = () => {
    const [confabSelect, setConfabSelect] = useState('');

    const getReservation = () => {
       
    };

    useEffect(() => {

    });

    return (
        <div>
            <select>
                <option>Confab 1</option>
                <option>Confab 2</option>
            </select>
            <select>
                <option>Pending</option>
                <option>Confirmed</option>
            </select>
            <input placeholder="Find by ID"></input>
            <button>Find By ID</button>
        </div>
    )
}

export default AdminReservation