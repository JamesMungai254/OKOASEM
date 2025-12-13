import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await axios.post('https://1a496bc012cb.ngrok-free.app/api/contact', formData);
      console.log('Message sent successfully:', response.data);
  
      // Reset the form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
  
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send the message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="container contact-form" id="contact">
      <div className="contact-image">
        <img src="https://image.ibb.co/kUagtU/rocket_contact.png" alt="rocket_contact" />
      </div>
      <form onSubmit={handleSubmit}>
        <h3>Drop Us a Message</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Your Phone Number *"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btnContact" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <textarea
                name="message"
                className="form-control"
                placeholder="Your Message *"
                style={{ width: '100%', height: '150px' }}
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Contact;
