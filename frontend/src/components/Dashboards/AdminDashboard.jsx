import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [year, setYear] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch uploaded files on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await axios.get('https://aa6c00879500.ngrok-free.app/api/files');
        setUploadedFiles(data);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };
    fetchFiles();
  }, []);

  // Form handlers
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFileNameChange = (e) => setFileName(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleCourseChange = (e) => setCourse(e.target.value);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !fileName || !year || !course) {
      setMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('year', year);
    formData.append('course', course);

    try {
      const { data } = await axios.post('https://aa6c00879500.ngrok-free.app/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(data.message);

      // Refresh file list after successful upload
      const fileResponse = await axios.get('https://aa6c00879500.ngrok-free.app/api/files');
      setUploadedFiles(fileResponse.data);
    } catch (err) {
      console.error('File upload failed:', err);
      setMessage('File upload failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* File Upload Form */}
      <form onSubmit={handleUpload}>
        <input
          type="text"
          value={fileName}
          onChange={handleFileNameChange}
          placeholder="Enter file name"
          required
        />
        <input
          type="text"
          value={year}
          onChange={handleYearChange}
          placeholder="Enter year (e.g., 1, 2, 3, 4)"
          required
        />
        <input
          type="text"
          value={course}
          onChange={handleCourseChange}
          placeholder="Enter course name"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload File</button>
      </form>
      <p>{message}</p>

      {/* Uploaded Files Table */}
      <h2>Uploaded Files</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>File Name</th>
            <th>Year</th>
            <th>Course</th>
            <th>Download Link</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file, index) => (
            <tr key={file._id}>
              <td>{index + 1}</td>
              <td>{file.originalName}</td>
              <td>{file.year}</td>
              <td>{file.course}</td>
              <td>
                <a href={`https://aa6c00879500.ngrok-free.app/uploads/${file.filename}`} download={file.originalName}>
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
