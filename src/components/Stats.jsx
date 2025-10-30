import CountUp from "react-countup";
import { FaHospital, FaUserMd, FaMapMarkerAlt } from "react-icons/fa";

const Stats = () => {
  return (
    <section className="py-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold text-rahaBlue mb-12">
        Our Reach & Impact
      </h2>
      <div className="flex justify-center gap-12 flex-wrap">
        {[
          {
            icon: <FaHospital className="text-rahaBlue text-4xl mx-auto mb-4" />,
            end: 1200,
            label: "Hospitals Analyzed",
          },
          {
            icon: <FaUserMd className="text-rahaBlue text-4xl mx-auto mb-4" />,
            end: 8000,
            label: "Doctors Mapped",
          },
          {
            icon: <FaMapMarkerAlt className="text-rahaBlue text-4xl mx-auto mb-4" />,
            end: 540,
            label: "Villages Covered",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 bg-white shadow-md rounded-xl w-60 transform hover:scale-105 transition duration-300"
          >
            {item.icon}
            <h3 className="text-3xl font-bold text-rahaGreen">
              <CountUp end={item.end} duration={3} enableScrollSpy />
              +
            </h3>
            <p className="text-rahaBlack">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
