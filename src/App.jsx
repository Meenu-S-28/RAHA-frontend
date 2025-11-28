import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import FacilityFinder from "./pages/NearestFacilityFinder";
import Explore from "./pages/Explore";
import ExploreHospitals from "./pages/ExploreHospitals";
import ExploreVillages from "./pages/ExploreVillages";
import AddHospital from "./pages/AddHospital";


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
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/hospitals" element={<ExploreHospitals />} />
        <Route path="/explore/villages" element={<ExploreVillages />} />
        <Route path="/add-hospital" element={<AddHospital  />} />

        
      </Routes>
    </Router>
  );
};

export default App;
