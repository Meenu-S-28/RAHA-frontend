import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const API_URL = import.meta.env.VITE_API_URL;

const villageIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [30, 30],
});

export default function VillageHospitalConnections() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/villages/connections`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <MapContainer
      center={[11.0168, 76.9558]}
      zoom={7}
      style={{ height: "85vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data.map((item, idx) => (
        <div key={idx}>
          {/* Village Marker */}
          <Marker position={item.village.coordinates} icon={villageIcon}>
            <Popup>
              <strong>{item.village.name}</strong><br />
              Access Score: {item.village.accessScore?.toFixed(2)}
            </Popup>
          </Marker>

          {/* Hospitals + Lines */}
          {item.hospitals.map((h, i) => (
            <div key={i}>
              <Marker position={h.coordinates} icon={hospitalIcon}>
                <Popup>
                  <strong>{h.name}</strong><br />
                  Distance: {h.distanceKm?.toFixed(1)} km
                </Popup>
              </Marker>

              <Polyline
                positions={[
                  item.village.coordinates,
                  h.coordinates
                ]}
                color={
                  i === 0 ? "green" :
                  i === 1 ? "orange" :
                  "red"
                }
                weight={2}
                opacity={0.7}
              />
            </div>
          ))}
        </div>
      ))}
    </MapContainer>
  );
}
