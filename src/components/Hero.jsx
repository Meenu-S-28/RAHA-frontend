import bgImage from "../assets/DocCoat.jpeg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative 
        bg-cover 
        bg-center 
        h-[85vh] 
        flex 
        items-center 
        justify-center 
        md:justify-end 
        px-6 
        md:px-16
      "
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="
        relative 
        z-10 
        text-white 
        max-w-3xl 
        text-center 
        md:text-right
      ">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Bridging the Gap in Rural Healthcare
        </h2>

        <p className="text-lg mb-8 opacity-90">
          RAHA helps analyze the distance and accessibility between villages and
          hospitals — enabling smarter planning for better health coverage.
        </p>

        <button
          onClick={() => navigate("/explore")}
          className="
            bg-white
            text-[#005086]
            px-8 
            py-3 
            rounded-lg 
            font-semibold
            shadow-lg
            hover:bg-gray-100
            hover:scale-105
            transition
          "
        >
          Explore RAHA
        </button>
      </div>
    </section>
  );
};

export default Hero;
