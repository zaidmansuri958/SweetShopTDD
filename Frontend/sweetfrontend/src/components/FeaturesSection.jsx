import React, { useState, useEffect, useRef } from 'react';


const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.dataset.animation]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animation]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => observerRef.current.disconnect();
  }, []);

  return (
    <section className="features" id="menu">
      <div className="container">
        <h2 className={`section-title fade-in ${isVisible.title ? 'visible' : ''}`} data-animation="title">
          Why Choose Sweet Shop?
        </h2>
        <div className="features-grid">
          <div className={`feature-card fade-in ${isVisible.card1 ? 'visible' : ''}`} data-animation="card1">
            <div className="feature-icon">🍫</div>
            <h3 className="feature-title">Premium Quality</h3>
            <p className="feature-description">Made with finest Belgian chocolate and organic ingredients.</p>
          </div>
          <div className={`feature-card fade-in ${isVisible.card2 ? 'visible' : ''}`} data-animation="card2">
            <div className="feature-icon">👨‍🍳</div>
            <h3 className="feature-title">Artisan Crafted</h3>
            <p className="feature-description">Handcrafted by master confectioners with decades of experience.</p>
          </div>
          <div className={`feature-card fade-in ${isVisible.card3 ? 'visible' : ''}`} data-animation="card3">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Fresh Delivery</h3>
            <p className="feature-description">Same-day delivery of fresh sweets to your doorstep.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
