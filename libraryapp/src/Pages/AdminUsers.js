import React,{useState, useEffect} from 'react'
import us from '../styles/AdminUsers.module.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AEUModal from './AEUModal';
import image1 from '../images/Edit_Icon.png';
import image2 from '../images/Delete_Icon.png';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [action, setAction] = useState('Delete');
  const [showEditModal, setShowEditModal] = useState(false);


  const fetchUsers = async (page) => {
    await axios.get(`http://localhost:5000/auth/all/${page}`, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    }).then(response => {
      setUsers(response.data.listOfUsers);
      setCount(response.data.count);
    })
      .catch(error => {
      });;
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage])

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleClick = (user, type) => {
    if (type === "Delete") {
      axios.delete(`http://localhost:5000/auth/${user.id}`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id")
        },
      })
        .then(response => {
          fetchUsers(currentPage);
        })
        .catch(error => {
        });
    }
    if (type === "Add") {
      setUserData([]);
      setAction(type);
      setShowEditModal(true);

    }

    if (type === "Edit") {
      setUserData(user);
      setAction(type);
      setShowEditModal(true);
    }
  }

  const handleConfirmUser = () => {
    setUserData({});
    setShowEditModal(false);
  };

  const handleCancelUser = () => {
    setShowEditModal(false);
    setAction('');
  };

  return (
    <div className={us.confabPage}>
    <div className={us.pageHeader}>
              <div className={us.section1}>
                  <p>User</p>
              </div>
              <div className={us.section2}>

              </div>
              <div className={us.section3}>
                  <div className={us.button1}>
                  <button className={us.addBtn} onClick={() => handleClick([], "Add")}><div className={us.plusSign}
                  >+</div><p>Add User</p></button>
                  </div>
              </div>
        </div>
      <div className={us.mainTable}>
      <table className={us.tableContainer}>
        <thead className={us.tableHeader} >
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Usernames</th>
            <th>Type</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length !== 0 ? (
            users.map((userObj, index) => {
              return (
                <tr key={index}>
                  <td>{userObj?.id}</td>
                  <td>{userObj?.name}</td>
                  <td>{userObj?.username}</td>
                  <td>{userObj?.type}</td>
                  <td><div className={us.passMaker}>
                    <input className={us.secInput4}
                           type="password"
                           value={userObj?.password} disabled/>
                        </div>
                  </td>
                  <td>
                        <button className={us.editButton} onClick={() => handleClick(userObj, 'Edit')}><img src={image1} alt=""></img></button>
                        <button className={us.deleteButton} onClick={() => handleClick(userObj, 'Delete')}><img src={image2} alt=""></img></button>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No data found</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      <div className='paginateContainer'>
      <ReactPaginate
        pageCount={Math.ceil(count / 7)} // number of pages
        pageRangeDisplayed={15}
        previousLabel={'Prev'}
        previousClassName='prevPaginate'
        nextLabel={'Next'}
        nextClassName='nextPaginate'
        marginPagesDisplayed={0}
        onPageChange={handlePageClick} // callback function for page change
        containerClassName='paginate'
        activeClassName='activePaginate'
        pageClassName='classPaginate'
      />
      </div>
      {showEditModal && (
        <AEUModal
          title={`${action} User`}
          data={userData}
          update={handleConfirmUser}
          cancel={handleCancelUser}
          updateUi={fetchUsers}
          action={action}
        />
      )}
      </div>
  )
}

export default AdminUsers