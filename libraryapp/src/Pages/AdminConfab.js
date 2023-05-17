import con from '../styles/AdminConfab.module.css';
import { useEffect, useState } from 'react'
import axios from 'axios';
import AECModal from './AECModal'
import image1 from '../images/Edit_Icon.png';
import image2 from '../images/Delete_Icon.png';

const AdminConfab = () => {
  const [confabs, setConfabs] = useState([]);
  const [confabData, setConfabData] = useState({});
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
    <div className={con.confabPage}>
      <div className={con.pageHeader}>
                <div className={con.section1}>
                    <p>Space</p>
                </div>
                <div className={con.section2}>

                </div>
                <div className={con.section3}>
                    <div className={con.button1}>
                    <button className={con.addBtn} onClick={() => handleClick([], "Add")}><div className={con.plusSign}
                    >+</div><p>Add Space</p></button>
                    </div>
                </div>
          </div>
        <div>
        <table className={con.tableContainer}>
          <thead className={con.tableHeader}>
            <tr>
              <th>Level</th>
              <th>Name</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={con.tableContent}>
            {confabs.map((confab, index) => (
              <tr
                key={confab.id}>
                <td>{confab.level}</td>
                <td>{confab.name}</td>
                <td>{confab.description}</td>
                <td>{confab.max_capacity}</td>
                <td>{confab.status}</td>
                <td>
                    <button className={con.editButton} onClick={() => handleClick(confab, "Edit")}><img src={image1} alt=""></img></button>
                    <button className={con.editButton} onClick={() => handleClick(confab, "Delete")}><img src={image2} alt=""></img></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showEditModal && (
          <AECModal
            title={`${action} Space`}
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