// frontend/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import '../../styles/Login.css'


function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://okoasembackend.onrender.com/api/login', formData);
      localStorage.setItem('token', data.token);
      
      

       // Decode token to get user role
       const decoded = jwtDecode(data.token);
       const { role } = decoded;
 
       // Redirect based on role
       if (role === 'admin') {
         navigate('/admin-dashboard');
       } else {
        localStorage.setItem('username', data.username); 
         navigate('/user-dashboard');
       }
    } catch (err) {
      alert('Login failed.');
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <input
        name="username"
        type="text"
        placeholder="Username"
        onChange={handleChange}
        className="form-control"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="form-control"
        required
      />
      <button type="submit" className="btn btn-primary btn-block">
        Login
      </button>
      <p>Don't have account? <a href="/register">Register</a>
      </p>
      <button><a href="/">Home</a></button>
    </form>
  </div>
  );
}

export default Login;
