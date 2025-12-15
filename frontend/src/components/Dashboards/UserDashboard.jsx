import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import Contact from '../Contact';
import Footer from '../Footer';


function UserDashboard() {
  const [files, setFiles] = useState([]);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [userYear, setUserYear] = useState('');
  const [userCourse, setUserCourse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('https://okoasembackend.onrender.com/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserName(data.username);
        setProfileImage(data.profileImage);
        setUserYear(data.year);
        setUserCourse(data.course);

        const filesResponse = await axios.get('https://okoasembackend.onrender.com/api/files', {
          params: { year: data.year, course: data.course },
        });
        setFiles(filesResponse.data);
      } catch (err) {
        console.error('Failed to fetch user info or files:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'https://okoasembackend.onrender.com/api/upload-profile-image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setProfileImage(`https://okoasembackend.onrender.com/uploads/${data.imageUrl}`);
      alert('Profile picture uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload profile picture.', err);
      alert('Upload failed. Please try again.');
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Group files by year and course
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.year]) acc[file.year] = {};
    if (!acc[file.year][file.course]) acc[file.year][file.course] = [];
    acc[file.year][file.course].push(file);
    return acc;
  }, {});

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">OKOASEM</a>
          <button className="navbar-toggler" bg="white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
            <form className="d-flex">
              <img
                src={profileImage || '/path/to/placeholder-image.jpg'}
                alt="User"
                className="user-image"
              />
              <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <h2>Welcome, {userName}!</h2>
      <p>Your Course: {userCourse}</p>
      <p>Your Year: {userYear}</p>

      <div className="upload-section">
        <input
          className="form-control me-2"
          type="file"
          onChange={handleFileChange}
        />
        <button className="btn btn-outline-success" onClick={handleUpload}>
          Upload Profile Picture
        </button>
      </div>

      <div className="files-section">
        <h2>Available Files</h2>
        {Object.entries(groupedFiles).map(([year, courses]) => (
          <div key={year} className="year-section">
            <h3>Year: {year}</h3>
            {Object.entries(courses).map(([course, files]) => (
              <div key={course} className="course-section">
                <h4>Course: {course}</h4>
                <table className="file-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>File Name</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={file._id}>
                        <td>{index + 1}</td>
                        <td>{file.originalName}</td>
                        <td>
                          <a
                            href={`https://okoasembackend.onrender.com/uploads/${file.filename}`}
                            download={file.originalName} 
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Contact />
      <Footer />
    </>
  );
}

export default UserDashboard;
