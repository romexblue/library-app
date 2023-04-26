import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const AdminStudent = () => {
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [action, setAction] = useState('Delete');
  const [showEditModal, setShowEditModal] = useState(false);
  
  const fetchStudents = async (page) => {
    await axios.get(`http://localhost:5000/student/all/${page}`, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    }).then(response => {
      setStudents(response.data.students);
      setCount(response.data.count);
    })
      .catch(error => {
      });;
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };
  const handleClick = (student, type) => {
    if (type === "Delete") {
      axios.delete(`http://localhost:5000/floor/${student.id}`, {
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
      setStudents([]);
      setAction(type);
      setShowEditModal(true);

    }
    if (type === "Edit") {
      setStudentData(student);
      setAction(type);
      setShowEditModal(true);
    }
  };

  const serverReq = () => {
    axios.get("http://localhost:5000/floor/all", {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then(response => {
        
      })
      .catch(error => {
      });
  };

  const handleConfirmFloor = () => {
    setStudentData({});
    setShowEditModal(false);
  };

  const handleCancelFloor = () => {
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
            <th>School ID</th>
            <th>RFID</th>
            <th>Type</th>
            <th>Date Of Expiry</th>
          </tr>
        </thead>
        <tbody>
          {students && students.length !== 0 ? (
            students.map((studentObj, index) => {
              return (
                <tr key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td>{studentObj?.id}</td>
                  <td>{studentObj?.name}</td>
                  <td>{studentObj?.school_id}</td>
                  <td>{studentObj?.rfid}</td>
                  <td>{studentObj?.type}</td>
                  <td>{studentObj?.date_of_expiry}</td>
                  <td style={{ border: 'none' }}>
                    {hoveredRow === index && (
                      <>
                        <button onClick={() => handleClick(studentObj, 'Edit')}>Edit</button>
                        <button onClick={() => handleClick(studentObj, 'Delete')}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>No data found</td>
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
    </div>
  )
}

export default AdminStudent