import con from '../styles/AdminConfab.module.css';
import { useEffect, useState } from 'react'
import axios from 'axios';
import AECModal from './AECModal'

const AdminConfab = () => {
  const [confabs, setConfabs] = useState([]);
  const [confabData, setConfabData] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [action, setAction] = useState('Delete');

  const serverReq = () => {
    axios.get("http://localhost:5000/confab/all", {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then(response => {
        setConfabs(response.data);
      })
      .catch(error => {
      });
  };

  useEffect(() => {
    serverReq();
  }, [])

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleClick = (confab, type) => {
    if (type === "Delete") {
      axios.delete(`http://localhost:5000/confab/${confab.id}`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id")
        },
      })
        .then(response => {
          serverReq();
        })
        .catch(error => {
        });
    }
    if (type === "Add") {
      setConfabData([]);
      setAction(type);
      setShowEditModal(true);
    }
    if (type === "Edit") {
      setConfabData(confab);
      setAction(type);
      setShowEditModal(true);
    }
  };

  const handleConfirmConfab = () => {
    setConfabData({});
    setShowEditModal(false);
  };

  const handleCancelConfab = () => {
    setShowEditModal(false);
    setAction('');
  };

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Name</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {confabs.map((confab, index) => (
              <tr
                key={confab.id}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <td>{confab.level}</td>
                <td>{confab.name}</td>
                <td>{confab.description}</td>
                <td>{confab.max_capacity}</td>
                <td>{confab.status}</td>
                <td style={{ border: 'none' }}>
                  {hoveredRow === index && (
                    <>
                      <button onClick={() => handleClick(confab, "Edit")}>Edit</button>
                      <button onClick={() => handleClick(confab, "Delete")}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => handleClick([], "Add")}>Add Confab</button>
        {showEditModal && (
          <AECModal
            title={`${action} Confab`}
            data={confabData}
            update={handleConfirmConfab}
            cancel={handleCancelConfab}
            updateUi={serverReq}
            action={action}
          />
        )}
      </div>
    </div>
  )
}

export default AdminConfab