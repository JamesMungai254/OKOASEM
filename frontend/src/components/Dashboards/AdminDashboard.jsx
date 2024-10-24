import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  // Fetch the uploaded files and contact messages when the component mounts
  useEffect(() => {
    const fetchFilesAndMessages = async () => {
      try {
        // Fetch uploaded files
        const fileResponse = await axios.get('http://localhost:5000/api/files');
        setUploadedFiles(fileResponse.data);

        // Fetch contact messages
        const messageResponse = await axios.get('http://localhost:5000/api/contact-messages');
        setContactMessages(messageResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchFilesAndMessages();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFileNameChange = (e) => setFileName(e.target.value);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);  // Append the file name

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData);
      setMessage(data.message);

      // Refresh the file list after upload
      const fileResponse = await axios.get('http://localhost:5000/api/files');
      setUploadedFiles(fileResponse.data);
    } catch (err) {
      setMessage('File upload failed.');
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
          type="file" 
          onChange={handleFileChange} 
          required 
        />
        <button type="submit">Upload File</button>
      </form>
      <p>{message}</p>

      {/* Uploaded Files Table */}
      <h2>Uploaded PDFs</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>File Name</th>
            <th>Download Link</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file, index) => (
            <tr key={file._id}>
              <td>{index + 1}</td>
              <td>{file.originalName}</td>
              <td>
                <a href={`http://localhost:5000/uploads/${file.filename}`} download={file.originalName}>
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Contact Messages Table */}
      <h2>Contact Messages</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {contactMessages.map((msg, index) => (
            <tr key={msg._id}>
              <td>{index + 1}</td>
              <td>{msg.name}</td>
              <td>{msg.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
