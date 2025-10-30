import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import FacilityFinder from "./pages/NearestFacilityFinder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Stats />
              <Carousel />
              <Footer />
            </>
          }
        />

        {/* Other Pages */}
        <Route path="/facility-finder" element={<FacilityFinder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
