// Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Register.css'; // Import custom styles
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    secretKey: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role' && value === 'user') {
      setFormData({ ...formData, [name]: value, secretKey: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match.');
    }

    if (formData.role === 'admin' && !formData.secretKey) {
      return alert('Admin Secret Key is required.');
    }

    try {
      await axios.post('https://okoasembackend.onrender.com/api/register', formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create an Account</h2>

        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          className="form-control"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
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
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="form-control"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-control"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === 'admin' && (
          <input
            name="secretKey"
            placeholder="Admin Secret Key"
            onChange={handleChange}
            className="form-control"
            required
          />
        )}

        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
        <p>Have an account? click<Link to="/login">here</Link></p>
        <button><Link to="/">Home</Link></button>
      </form>
      
    </div>
  );
}

export default Register;
