import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import About from './About';
import Contact from './Contact';
import FAQ from './FAQS';
import Footer from './Footer';
import '../styles/index.css';
function Index() {
  return (
    <>
    <div className="HomePage">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark " style={{opacity:'0.9'}}>
        <div className="container-fluid">
    <a className="navbar-brand" href="#">OKOASEM</a>
    <button className="navbar-toggler"  type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" style={{backgroundColor:'white'}}></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#home">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#about">About</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Data Science
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="/login">Year 1</a></li>
            <li><a className="dropdown-item" href="/login">Year 2</a></li>
            <li><a className="dropdown-item" href="/login">Year 3</a></li>
            <li><a className="dropdown-item" href="/login">Year 4</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item" href="#faq">FAQs</a></li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#contact">Contact</a>
        </li>
      </ul>
      
    </div>
    <span className='cssanimation typing' style={{color:'white'}} >
      Empowering Students, Building Foundations in Learning.
    </span>
  </div>
  
</nav>


<section className="index-container ">
    <div className='cssanimation hu__hu__' id='home'>
       <h1 style={{color:'white'}}> Welcome to OKOASEM</h1>
    </div>
    
 </section>


    </div>
    <About />
    <Contact />
    <FAQ />
    <Footer/>
  </>
  )
}

export default Index;