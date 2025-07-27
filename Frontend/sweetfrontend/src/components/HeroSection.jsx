// import React from 'react';
// import { useNavigate } from 'react-router-dom';


// const HeroSection = () => {
//   const navigate = useNavigate();
//   const handleLogin = () => navigate('/login');
//   const handleRegister = () => navigate('/register');

//   return (
//     <section className="hero" id="home">
//       <div className="hero-content">
//         <h1 className="hero-title">Sweet Dreams Come True</h1>
//         <p className="hero-subtitle">
//           Discover our premium collection of handcrafted confections, made with love and the finest ingredients
//         </p>
//         <div className="hero-buttons">
//           <button className="btn btn-primary" onClick={handleLogin}>Login</button>
//           <button className="btn btn-secondary" onClick={handleRegister}>Register</button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import sweetsImage from '../assets/sweet-hero.jpg'; // Make sure you save the image here

const HeroSection = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-title">Indulge in Sweet Paradise 🍭</h1>
        <p className="hero-subtitle">
          Discover our premium collection of handcrafted confections, made with love and the finest ingredients.
        </p>
        <p className="hero-tagline">
          Where every bite is a celebration of joy and flavor!
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          <button className="btn btn-secondary" onClick={handleRegister}>Register</button>
        </div>
      </div>

      <div className="hero-right">
        <img src={sweetsImage} alt="Sweet Collection" className="hero-image" />
      </div>
    </section>
  );
};

export default HeroSection;
