import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});

export default function NearestFacilityFinder() {
  const hospitals = [
    { name: "Green Valley Clinic", lat: 10.98, lng: 76.96 },
    { name: "City Hospital", lat: 10.99, lng: 76.95 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-[#005086] mb-6">
        Nearest Facility Finder
      </h1>
      <p className="text-gray-600 mb-4">
        Find hospitals and healthcare centres closest to your location.
      </p>

      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border">
        <MapContainer
          center={[10.98, 76.96]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          {hospitals.map((h, i) => (
            <Marker key={i} position={[h.lat, h.lng]} icon={hospitalIcon}>
              <Popup>{h.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
