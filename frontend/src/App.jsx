import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './components/Index';
import About from './components/About';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import DataScience1 from './components/DataScience/DataScience1';
import DataScience2 from './components/DataScience/DataScience2';
import DataScience3 from './components/DataScience/DataScience3';
import DataScience4 from './components/DataScience/DataScience4';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import Contact from './components/Contact';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
            <Route path="/1" element={<DataScience1 />} />
            <Route path="/2" element={<DataScience2 />} />
            <Route path="/3" element={<DataScience3 />} />
            <Route path="/4" element={<DataScience4 />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
        
    </>
  )
}

export default App
