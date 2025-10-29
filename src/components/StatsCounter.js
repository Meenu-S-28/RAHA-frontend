import React from "react";
import CountUp from "react-countup";
import "../styles/StatsCounter.css";

export default function StatsCounter() {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <h2><CountUp end={150} duration={3} />+</h2>
        <p>Villages Connected</p>
      </div>
      <div className="stat-card">
        <h2><CountUp end={40} duration={3} />+</h2>
        <p>Hospitals / NGOs Partnered</p>
      </div>
      <div className="stat-card">
        <h2><CountUp end={25} duration={3} />+</h2>
        <p>Government Districts Impacted</p>
      </div>
    </div>
  );
}
