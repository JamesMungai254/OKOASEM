import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/UserDashboard.css';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [files, setFiles] = useState([]);  // State to hold files fetched from the backend
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Fetch user info from backend
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched User Data:', data);

        setUserName(data.username);  // Set the user's name
        setProfileImage(data.profileImage);  // Set the user's profile image
      } catch (err) {
        console.error('Failed to fetch user info.', err);
      }
    };

    // Fetch uploaded files from backend
    const fetchFiles = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/files');
        setFiles(data);  // Set the files to state
      } catch (err) {
        console.error('Failed to fetch files.');
      }
    };

    fetchUserData();  // Call to fetch user data
    fetchFiles();  // Call to fetch files
  }, []);

  // Handle profile image file change
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // Handle profile image upload
  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/upload-profile-image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setProfileImage(`http://localhost:5000/uploads/${data.imageUrl}`);  // Update the profile image with the new one
      alert('Profile picture uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload profile picture.', err);
      alert('Upload failed. Please try again.');
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    
    localStorage.removeItem('token');  // Remove the token from localStorage
    navigate('/login');  // Redirect the user to the login page
  };

  return (
    <>
      {/* ************************************Navigation Bar************************************** */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">OKOASEM</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="e">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">About</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Data Science
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Year 1</a></li>
                  <li><a className="dropdown-item" href="#">Year 2</a></li>
                  <li><a className="dropdown-item" href="#">Year 3</a></li>
                  <li><a className="dropdown-item" href="#">Year 4</a></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><a className="dropdown-item" href="#">FAQs</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
              </li>
            </ul>
            <form class="d-flex">
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

      {/* ************************************User Dashboard************************************** */}
      <h2>Welcome, {userName}!</h2>

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
        <h2>Current Papers and PDFs</h2>
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
                <td>{index + 1}</td>  {/* Display index as serial number */}
                <td>{file.originalName}</td>  {/* Display the file name */}
                <td>
                  <a
                    href={`http://localhost:5000/uploads/${file.filename}`}
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
    </>
  );
}

export default UserDashboard;
