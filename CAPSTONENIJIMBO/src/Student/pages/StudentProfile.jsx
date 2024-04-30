import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './StudentProfile.css';

const StudentProfile = () => {
  const { studentID } = useParams();
  const [student, setStudent] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [updatingTeacher, setUpdatingTeacher] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);  
  const [profilePicture, setProfilePicture] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/teacherstudent/${studentID}`);
        setTeachers(response.data.map(item => item.teacher));
      } catch (error) {
        console.error('Error fetching student or teacher data:', error);
      }
    };

    fetchData();
  }, [studentID]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getByStudentID/${studentID}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentID]);

  useEffect(() => {
    const fetchAllTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getallteachers');
        setAllTeachers(response.data);
      } catch (error) {
        console.error('Error fetching all teachers:', error);
      }
    };

    fetchAllTeachers();
  }, []);

  const assignTeacher = async () => {
    try {
      const response = await axios.post('http://localhost:8080/assign', null, {
        params: {
          studentID: studentID,
          userid: selectedTeacher
        }
      });
      setShowModal(true); // Show modal upon successful assignment
    } catch (error) {
      console.error('Error assigning teacher:', error);
    }
  };

  const updateTeacher = async (teacherID) => {
    setUpdatingTeacher(teacherID);
  };

  const saveUpdatedTeacher = async () => {
    try {
      const response = await axios.put('http://localhost:8080/updateTeacher', null, {
        params: {
          studentID: studentID,
          userid: selectedTeacher
        }
      });
      setShowModal(true); // Show modal upon successful update
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    window.location.reload(); // Refresh the page after closing the modal
  };
  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };
  const updateProfilePicture = async () => {
    try {
      const formData = new FormData();
      formData.append('profile', profilePicture);
      const response = await axios.put(`http://localhost:8080/addpicture/${studentID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowModal(true); // Show modal upon successful picture update
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };


  
  return (
    <div className='student-profile'>
      <h2>Student Profile</h2>
          <div className="profile-details">

          <div className='student-profile-picture'>
          <div className='profile'>
            {student.profile && <p><img src={`data:image/png;base64,${student.profile}`} alt={student.firstName} /></p>}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button className='updatephoto' onClick={updateProfilePicture}>Update Profile Picture</button>
          </div>
        </div>

            <div className="student-profile-credentials">
                <p><strong>Student ID:</strong> {student.studentID}</p>
                <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Course:</strong> {student.course}</p>

                <div className="teachers-list">
                <p><strong>Teacher Assigned:</strong></p>
                {teachers.length > 0 ? (
                  <ul>
                    {teachers.map((teacher, index) => (
                    <li key={index}>
                    {teacher.firstName} {teacher.lastName}
                    <button onClick={() => updateTeacher(teacher.userid)}>Update Teacher</button>
                    {updatingTeacher === teacher.userid && (
                <div>
                    <select onChange={(e) => setSelectedTeacher(e.target.value)}>
                    <option value="">Select Teacher</option>
                    {allTeachers.map((teacher) => (
                    <option key={teacher.userid} value={teacher.userid}>
                    {teacher.firstName} {teacher.lastName}
                    </option>
                    ))}
                    </select>
                    <button onClick={saveUpdatedTeacher}>Save</button>
                </div>
                  )}
                    </li>
                  ))}
                    </ul>
                  ) : (
                <div>
                    <p>No assigned teacher</p>
                    <p>Assign a teacher:</p>
                    <select onChange={(e) => setSelectedTeacher(e.target.value)}>
                    <option value="">Select Teacher</option>
                    {allTeachers.map((teacher) => (
                    <option key={teacher.userid} value={teacher.userid}>
                    {teacher.firstName} {teacher.lastName}
                    </option>
                    ))}
                    </select>
                    <button onClick={assignTeacher}>
                    Assign Teacher
                    </button>
                    </div>
                    )}
              </div>
              {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                      <h3>Teacher Assigned!</h3>
                      <button onClick={closeModal}>Close</button>
                    </div>
                </div>
                )}
            </div>

            <div className="student-profile-btns">
                <button onClick={() => setQrVisible(!qrVisible)}>
                  {qrVisible ? 'Hide QR Code' : 'Show QR Code'}
                </button>
                  {qrVisible && (
                    <div className="modal-overlay">
                      <div className="modal">
                        <h3>QR Code for Student ID</h3>
                        <QRCode value={student.studentID} />
                        <button onClick={closeModal}>Close</button>
                      </div>
                    </div>
                    )}
              </div>

              
          </div>
    </div>


  
  );
};

export default StudentProfile;

  // <div><h2>Student Profile</h2>
    // <div className="student-profile">
    //   <div className="profile-details">

    //   <div className="profile">
    //   <img src={profileImage} alt="Profile Picture" className="profile-image" />
    //   <input type="file" onChange={handleImageChange} accept="image/*" />
    //   <label htmlFor="file-input" className="change-picture-button">Change Picture</label>
    //   </div>
    

    //     <p><strong>Student ID:</strong> {student.studentID}</p>
    //     <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
    //     <p><strong>Email:</strong> {student.email}</p>
    //     <p><strong>Course:</strong> {student.course}</p>

    //     <button onClick={() => setQrVisible(!qrVisible)}>
    //       {qrVisible ? 'Hide QR Code' : 'Show QR Code'}
    //     </button>
    //     {qrVisible && (
    //       <div className="modal-overlay">
    //         <div className="modal">
    //           <h3>QR Code for Student ID</h3>
    //           <QRCode value={student.studentID} />
    //           <button onClick={closeModal}>Close</button>
    //         </div>
    //       </div>
    //     )}

    //     <div className="teachers-list">
    //       <p><strong>Teacher Assigned:</strong></p>
    //       {teachers.length > 0 ? (
    //         <ul>
    //           {teachers.map((teacher, index) => (
    //             <li key={index}>
    //               {teacher.firstName} {teacher.lastName}
    //               <button onClick={() => updateTeacher(teacher.userid)}>Update Teacher</button>
    //               {updatingTeacher === teacher.userid && (
    //                 <div>
    //                   <select onChange={(e) => setSelectedTeacher(e.target.value)}>
    //                     <option value="">Select Teacher</option>
    //                     {allTeachers.map((teacher) => (
    //                       <option key={teacher.userid} value={teacher.userid}>
    //                         {teacher.firstName} {teacher.lastName}
    //                       </option>
    //                     ))}
    //                   </select>
    //                   <button onClick={saveUpdatedTeacher}>Save</button>
    //                 </div>
    //               )}
    //             </li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <div>
    //           <p>No assigned teacher</p>
    //           <p>Assign a teacher:</p>
    //           <select onChange={(e) => setSelectedTeacher(e.target.value)}>
    //             <option value="">Select Teacher</option>
    //             {allTeachers.map((teacher) => (
    //               <option key={teacher.userid} value={teacher.userid}>
    //                 {teacher.firstName} {teacher.lastName}
    //               </option>
    //             ))}
    //           </select>
    //           <button onClick={assignTeacher}>
    //             Assign Teacher
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    //   {showModal && (
    //     <div className="modal-overlay">
    //       <div className="modal">
    //         <h3>Teacher Assigned!</h3>
    //         <button onClick={closeModal}>Close</button>
    //       </div>
    //     </div>
    //   )}
    // </div>
    // </div>