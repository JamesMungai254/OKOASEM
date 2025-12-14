import React, { useState, useEffect } from 'react';
import '../styles/About.css';


function About() {
  const [showButton, setShowButton] = useState(false);

  // Show button when page is scrolled beyond 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top smoothly when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='about-container' id='about'>
      <h1>About Us</h1>
      <p>
        OKOASEM is an innovative platform designed to support students in their academic journey by providing access to past exam papers, particularly in Data Science, along with revision materials in PDF format. 
        , OKOASEM is committed to enhancing learning and academic success.
      </p>
      <p>
        At OKOASEM, our vision is to empower students with comprehensive resources, enabling them to prepare effectively for exams and deepen their understanding of critical concepts. 
        We believe that access to quality learning materials is essential for building a strong foundation in education.
      </p>
      <p>
        Our mission is to make a meaningful impact by fostering academic excellence and nurturing the next generation of skilled professionals. 
        Through our platform, we aim to equip students with the tools they need to excel in their studies and thrive in their chosen fields.
      </p>

      {/* Back to Top Button */}
      {showButton && (
        <button className='back-to-top' onClick={scrollToTop}>
          ↑ 
        </button>
      )}
    </div>
  );
}

export default About;
