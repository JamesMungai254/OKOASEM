import React from 'react';
import '../styles/FAQS.css'  // CSS file for styling

function FAQ() {
  const faqs = [
    {
      question: "What is Okoasem?",
      answer:
        "Okoasem is an application designed to provide students access to academic resources such as research papers, lecture notes, and course-specific files organized by year and course.",
    },
    {
      question: "How do I upload my profile picture?",
      answer:
        "You can upload a profile picture on your dashboard by clicking the 'Upload Profile Picture' button, selecting your file, and then pressing upload.",
    },
    {
      question: "How do I download files?",
      answer:
        "Files can be downloaded from the dashboard. You’ll see a list of available documents relevant to your course and year. Click the 'Download' link next to the desired file.",
    },
    {
      question: "What should I do if I forgot my login credentials?",
      answer:
        "If you forgot your password, navigate to the login page and click on 'Forgot Password' to reset it. An email will be sent to help you recover access.",
    },
    {
      question: "Who can access Okoasem’s admin features?",
      answer:
        "Only users with administrator access can upload and manage documents for different courses and years.",
    },
    {
      question: "Can I filter files by course or year?",
      answer:
        "Yes, files are organized by course and year, so you can easily find resources specific to your academic level.",
    },
  ];

  return (
    <div className="faq-container" id='faq'>
      <h2 className="faq-title">Okoasem Frequently Asked Questions (FAQs)</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
