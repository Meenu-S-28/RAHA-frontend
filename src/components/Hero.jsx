import villagers from "../assets/Villagers.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate(); 
  
  return (
    <section
      className="relative bg-cover bg-center h-[85vh] flex flex-col justify-center items-center text-center px-6"
      style={{ backgroundImage: `url(${villagers})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-white max-w-3xl">
        <h2 className="text-5xl font-extrabold mb-4">
          Bridging the Gap in Rural Healthcare
        </h2>
        <p className="text-lg mb-8">
          RAHA helps analyze the distance and accessibility between villages and
          hospitals — enabling smarter planning for better health coverage.
        </p>
        <button 
        onClick={() => navigate("/explore")} 
        className="bg-rahaGreen px-8 py-3 rounded-lg font-semibold text-white hover:bg-green-600 transition" >
          Explore RAHA
        </button>
      </div>
    </section>
  );
};

export default Hero;
