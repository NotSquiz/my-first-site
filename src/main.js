// Main JavaScript file for the application
import './styles.css';

// Add any JavaScript functionality here
document.addEventListener('DOMContentLoaded', () => {
  console.log('Site loaded successfully!');
  
  // Form submission handling
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! This is a demo form.');
      contactForm.reset();
    });
  }
});
