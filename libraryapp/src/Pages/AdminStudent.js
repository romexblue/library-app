import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";
import AESModal from './AESModal';
import stu from '../styles/AdminStudent.module.css';
import image1 from '../images/search_icon.png'
import image2 from '../images/Edit_Icon.png';
import image3 from '../images/Delete_Icon.png';

const AdminStudent = ({ adminData }) => {
  const navigate = useNavigate();
  const [idValue, setIdValue] = useState('');
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [action, setAction] = useState('Delete');
  const [showEditModal, setShowEditModal] = useState(false);

  const findStudentById = (event) => {
    event.preventDefault();
    if (!idValue) { return; }

    axios.get(`http://localhost:5000/student/find/${idValue}`, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then((response) => {
        if (response.data.error) {
          setStudents([])
        } else {
          setStudents([response.data])
        }
        setCount(0);
        setCurrentPage(1);
      })
  }

  const handleValueChange = (event) => {
    setIdValue(event.target.value);
    if (event.target.value === '') {
      fetchStudents(currentPage);
    }
  }

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

  const handleClick = (student, type) => {

    if (type === "Delete") {
      axios.delete(`http://localhost:5000/student/${student.id}`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id")
        },
      })
        .then(response => {
          fetchStudents(currentPage);
        })
        .catch(error => {
        });
    }
    if (type === "Add") {
      setStudentData([]);
      setAction(type);
      setShowEditModal(true);

    }

    if (type === "Edit") {
      setStudentData(student);
      setAction(type);
      setShowEditModal(true);
    }
  }

  const handleConfirmStudent = () => {
    setStudentData({});
    setShowEditModal(false);
  };

  const handleCancelStudent = () => {
    setShowEditModal(false);
    setAction('');
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div>
      <div className={stu.pageHeader}>
        <div className={stu.section1}>
          <p>Patron</p>
        </div>
        <div className={stu.section2}>
          <form onSubmit={(event) => findStudentById(event)} className={stu.searchForm}>
            <input value={idValue} onChange={(event) => handleValueChange(event)} className={stu.searchInput} type="number" placeholder="Find by ID" ></input>
            <button type="submit" className={stu.searchBtnBox} ><img className={stu.searchBtn} src={image1}></img></button>
          </form>
        </div>
        <div className={stu.section3}>
          <div className={stu.button1}>
            <button className={stu.addBtn} onClick={() => navigate('/registration', { state: { userType: adminData.type, name: adminData.name } })}><p>Registration Wizard</p></button>
          </div>
        </div>
      </div>
      <div className={stu.mainTable}>
        <table className={stu.tableContainer}>
          <thead className={stu.tableHeader}>
            <tr>
              <th>School ID</th>
              <th>Type</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Sex</th>
              <th>College</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>
        </table>
        <table className={stu.tableContents}>
          <tbody className={stu.tableBody}>
            {students && students.length !== 0 ? (
              students.map((studentObj, index) => {
                return (
                  <tr key={index}>
                    <td>{studentObj?.school_id}</td>
                    <td>{studentObj?.type}</td>
                    <td>{studentObj?.first_name}</td>
                    <td>{studentObj?.last_name}</td>
                    <td>{studentObj?.gender}</td>
                    <td>{studentObj?.college}</td>
                    <td>{studentObj?.year}</td>
                    <td>
                      <button className={stu.editButton} onClick={() => handleClick(studentObj, 'Edit')}><img alt='edit' src={image2}></img></button>
                      <button className={stu.deleteButton} onClick={() => handleClick(studentObj, 'Delete')}><img alt='edit' src={image3}></img></button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='paginateContainer'>
      <ReactPaginate
        pageCount={Math.ceil(count / 7)} // number of pages
        pageRangeDisplayed={7}
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
        <AESModal
          title={`${action} Student`}
          data={studentData}
          update={handleConfirmStudent}
          cancel={handleCancelStudent}
          updateUi={fetchStudents}
          action={action}
        />
      )}
    </div>
  )
}

export default AdminStudent