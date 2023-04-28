import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AEUModal from './AEUModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
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

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
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
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Type</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length !== 0 ? (
            users.map((userObj, index) => {
              return (
                <tr key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td>{userObj?.id}</td>
                  <td>{userObj?.name}</td>
                  <td>{userObj?.username}</td>
                  <td>{userObj?.type}</td>
                  <td>{userObj?.password}</td>
                  <td style={{ border: 'none' }}>
                    {hoveredRow === index && (
                      <>
                        <button onClick={() => handleClick(userObj, 'Edit')}>Edit</button>
                        <button onClick={() => handleClick(userObj, 'Delete')}>Delete</button>
                      </>
                    )}
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
      <ReactPaginate
        pageCount={Math.ceil(count / 10)} // number of pages
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick} // callback function for page change
        containerClassName="pagination"
        activeClassName="active"
      />
      <button onClick={() => handleClick([], "Add")}>Add User</button>
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