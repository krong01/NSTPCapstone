import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminTeachers.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';

function AdminTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [students, setStudents] = useState([]); // State to hold students associated with the selected teacher
    const { adminID } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8080/getallteachers')
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error('Error fetching teachers:', error);
            });
    }, []);

    const deleteTeacher = (userid) => {
        axios.delete(`http://localhost:8080/deleteteacher/${userid}`)
            .then(response => {
                setTeachers(teachers.filter(teacher => teacher.userid !== userid));
            })
            .catch(error => {
              if (error.response && error.response.status === 500) {
                // If the error is due to foreign key constraint
                alert("Student is assigned to the teacher. Teacher cannot be deleted.");
            } else {
                console.error('Error deleting teacher:', error);
            }
            });
    };

    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher);
        setModalOpen(true);

        // Fetch students associated with the selected teacher
        axios.get(`http://localhost:8080/byteacherid/${teacher.userid}`)
    .then(response => {
        
        setStudents([response.data.student]); 
        console.log(setStudents)// Access the student property and set it as an array
    })
    .catch(error => {
        console.error('Error fetching students:', error);
    });
    };

    return (
        <div className="container">
            <div className="header">
                <h1>List of Teachers</h1>
                <Link to={`/Admin/AddTeacher/${adminID}`}>
                    <FontAwesomeIcon icon={faPlus} />
                </Link>
            </div>
            <ul>
                {teachers.map(teacher => (
                    <li key={teacher.userid} onClick={() => handleTeacherClick(teacher)}>
                        {teacher.firstName} {teacher.lastName} - ID: {teacher.teacherID}
                        <button onClick={(e) => { e.stopPropagation(); deleteTeacher(teacher.userid) }}>
                            <FontAwesomeIcon icon={faUserXmark} />
                        </button>
                    </li>
                ))}
            </ul>

            {modalOpen && selectedTeacher && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                      
                        <h2>{selectedTeacher.firstName} {selectedTeacher.lastName}</h2>
                        <div class="image">
      <div class="circle-1"></div>
      <div class="circle-2"></div>
      
    
                        <img src={`data:image/png;base64,${selectedTeacher.profile}`} alt={selectedTeacher.firstName} />
                        </div>
                        <p>Teacher ID: {selectedTeacher.teacherID}</p>
                        <p>Email: {selectedTeacher.email} </p>
                        <p>Assigned Year: {selectedTeacher.assignedYear}</p>

                        <h3>Students:</h3>
                        <ul>
                            {students.map(student => (
                                <li key={student.userid}>
                                    {student.firstName} {student.lastName} (ID: {student.studentID})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminTeachers;