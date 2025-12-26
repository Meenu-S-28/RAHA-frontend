import { Link } from "react-router-dom";
import logo from "../assets/RAHALogo.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* LOGO */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="RAHA Logo"
          className="
            h-12 w-auto
            md:h-18
            lg:h-18
            object-contain
          "
        />
      </div>

      {/* NAV LINKS */}
      <div className="hidden md:flex gap-6 text-rahaBlue font-semibold">
        <Link to="/" className="hover:text-[#10A245] transition">Home</Link>
        <Link to="/facility-finder" className="hover:text-[#10A245] transition">
          Nearest Facility Finder
        </Link>
        <Link to="/explore" className="hover:text-[#10A245] transition">
          Explore
        </Link>
        <Link to="/add-hospital" className="hover:text-[#10A245] transition">
          Add Hospital
        </Link>
        <Link to="/camp-recommendations" className="hover:text-[#10A245] transition">
          Camp Recommendation
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
