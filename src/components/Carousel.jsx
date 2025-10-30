import imageC1 from "../assets/imageC1.png";
import imageC2 from "../assets/imageC2.jpeg";
import imageC3 from "../assets/imageC3.png";
import imageC4 from "../assets/imageC4.png";
import imageC5 from "../assets/imageC5.png";
import imageC6 from "../assets/imageC6.png";
import imageC7 from "../assets/imageC7.png";
import imageC8 from "../assets/imageC8.png";
import imageC9 from "../assets/imageC9.png";
import imageC10 from "../assets/imageC10.png";

const imagesTop = [imageC1, imageC2, imageC3, imageC4, imageC5];
const imagesBottom = [imageC6, imageC7, imageC8, imageC9, imageC10];

export default function Carousel() {
  return (
    <section className="bg-gradient-to-b from-white to-[#f5f8fa] py-16 px-4 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-[#005086] mb-10">
        Our Impact in Rural Healthcare
      </h2>

      {/* TOP CAROUSEL */}
      <div className="relative w-full overflow-hidden mb-10">
        <div className="flex animate-scroll-left gap-6">
          {[...imagesTop, ...imagesTop].map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[250px] h-[180px] rounded-xl overflow-hidden shadow-md bg-white"
            >
              <img
                src={src}
                alt={`impact-${i}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CAROUSEL */}
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll-right gap-6">
          {[...imagesBottom, ...imagesBottom].map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[250px] h-[180px] rounded-xl overflow-hidden shadow-md bg-white"
            >
              <img
                src={src}
                alt={`impact-${i}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-600 mt-10 max-w-2xl mx-auto">
        Through data-driven insights and accessible care mapping, RAHA is
        bridging the gap between rural populations and essential healthcare
        services.
      </p>
    </section>
  );
}
