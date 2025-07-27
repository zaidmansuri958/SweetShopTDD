import React, { useEffect, useState } from 'react';


const Navbar = () => {
  const [navBackground, setNavBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavBackground(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${navBackground ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">🍭 Sweet Verse</div>
        <ul className="nav-links">
          <li><button onClick={() => handleNavClick('#home')}>Home</button></li>
          <li><button onClick={() => handleNavClick('#menu')}>Menu</button></li>
          <li><button onClick={() => handleNavClick('#about')}>About</button></li>
          <li><button onClick={() => handleNavClick('#contact')}>Contact</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
