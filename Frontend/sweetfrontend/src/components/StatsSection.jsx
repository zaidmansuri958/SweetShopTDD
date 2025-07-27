import React from 'react';

const StatsSection = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '200+', label: 'Sweet Varieties' },
    { number: '15+', label: 'Years Experience' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
