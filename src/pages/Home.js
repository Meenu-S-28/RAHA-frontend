import React from "react";
import Navbar from "../components/Navbar.js"
import StatsCounter from "../components/StatsCounter";
import villagers from "../assets/villagers.jpeg";
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="hero-section">
        <div className="hero-content">
          <h1>RAHA - Rural Access to Healthcare Analyzer</h1>
          <p className="tagline">
            Bridging the healthcare gap for rural and underserved communities.
          </p>
          <p className="description">
            The purpose of the RAHA project is to bridge the gap in healthcare accessibility
            for rural and underserved communities by providing a digital healthcare platform
            that connects patients, community health workers (CHWs), and healthcare providers.
          </p>
          <ul className="impact-list">
            <li><strong>For Villages:</strong> Increased access to healthcare information and facilities.</li>
            <li><strong>For Hospitals/NGOs:</strong> Data-driven planning of mobile health camps.</li>
            <li><strong>For Governments:</strong> Evidence-based policy making and resource allocation.</li>
          </ul>
        </div>

        <div className="hero-image">
          <img src={villagers} alt="Villagers illustration" />
        </div>
      </section>

      <StatsCounter />
    </>
  );
}
