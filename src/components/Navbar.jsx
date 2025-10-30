import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="RAHA Logo" className="h-10 w-13 mt-1" />
        <div className="flex flex-col justify-center leading-tight">
          <h1 className="text-2xl font-bold text-[#005086]">RAHA</h1>
          <p className="text-sm text-[#10A245] -mt-0.5 tracking-wide">
            Rural Access to Healthcare Analyser
          </p>
        </div>
      </div>

      <div className="flex gap-6 text-rahaBlue font-semibold">
        <Link to="/">Home</Link>
        <Link to="/facility-finder">Nearest Facility Finder</Link>
        <Link to="/specialities">Hospitals Nearby</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
