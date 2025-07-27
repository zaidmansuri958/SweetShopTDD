import React from 'react';

const Footer = () => {
  const handleNavClick = (href) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sweet Shop</h3>
          <p>Premium confectionery crafted with passion. Making life sweeter since 2008.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p><button onClick={() => handleNavClick('#home')}>Home</button></p>
          <p><button onClick={() => handleNavClick('#menu')}>Menu</button></p>
          <p><button onClick={() => handleNavClick('#about')}>About</button></p>
          <p><button onClick={() => handleNavClick('#contact')}>Contact</button></p>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📍 123 Sweet Street, Candy City</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>✉️ hello@sweetshop.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Sweet Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
