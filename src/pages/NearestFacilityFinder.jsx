import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  // Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- ICONS ---------------- */
const icon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const hospitalIcons = {
  0: icon("green"),
  1: icon("yellow"),
  2: icon("red"),
};

const villageIcon = icon("blue");
const userIcon = icon("violet");

/* ---------------- DISTRICTS ---------------- */
const DISTRICTS = [
  "Ariyalur",
  "Perambalur",
  "Ramanathapuram",
  "Dharmapuri",
  "Krishnagiri",
  "Sivaganga",
  "Kanchipuram"
];

/* ---------------- RECENTER ---------------- */
function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 11);
  }, [center]);
  return null;
}

/* ---------------- MAIN ---------------- */
export default function NearestFacilityFinder() {
  const [villages, setVillages] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [connections, setConnections] = useState([]);

  const [locationMode, setLocationMode] = useState("current");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const [center, setCenter] = useState([11.0168, 76.9558]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* -------- FETCH VILLAGES -------- */
  useEffect(() => {
    axios.get(`${API_URL}/villages`).then((res) => setVillages(res.data));
  }, []);

  /* -------- CURRENT LOCATION -------- */
  useEffect(() => {
    if (locationMode === "current") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
          loadNearestHospitals({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => setCenter([11.0168, 76.9558])
      );
    }
  }, [locationMode]);

  /* -------- FILTERED VILLAGES -------- */
  const filteredVillages = villages.filter(
    (v) => v.district === selectedDistrict
  );

  /* -------- VILLAGE SELECTION -------- */
  async function handleVillageSelect(villageId) {
    const village = villages.find((v) => v.villageId === villageId);
    if (!village) return;

    const [lng, lat] = village.location.coordinates;
    setCenter([lat, lng]);

    /* NO FACILITY → USE STORED NEAREST */
    if (selectedFacilities.length === 0) {
      const hospitalDocs = await axios.get(`${API_URL}/hospitals`);
      const nearest = hospitalDocs.data.filter((h) =>
        village.nearestHospitals.includes(h.hospitalId)
      );

      setHospitals(nearest.slice(0, 3));
      setConnections(
        nearest.slice(0, 3).map((h) => [
          [lat, lng],
          [h.location.coordinates[1], h.location.coordinates[0]],
        ])
      );
    } else {
      loadNearestHospitals({
        lat,
        lng,
        service: selectedFacilities[0],
      });
    }
  }

  /* -------- NEAREST FROM API -------- */
  async function loadNearestHospitals({ lat, lng, service }) {
    const res = await axios.get(`${API_URL}/hospitals/nearest`, {
      params: { lat, lng, service, limit: 3 },
    });

    const data = res.data.data;
    setHospitals(data);
    setConnections(
      data.map((h) => [
        [lat, lng],
        [h.coordinates[1], h.coordinates[0]],
      ])
    );
  }

  /* -------- APPLY -------- */
  function applyFilters() {
    if (locationMode === "village" && selectedVillageId) {
      handleVillageSelect(selectedVillageId);
    }
  }

  function clearFilters() {
    setSelectedDistrict("");
    setSelectedVillageId("");
    setSelectedFacilities([]);
    setHospitals([]);
    setConnections([]);
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex min-h-screen">
      {/* -------- SIDEBAR -------- */}
      <aside className="w-[340px] bg-white shadow-xl p-5">
        <h2 className="text-xl font-bold text-[#005086] mb-4">
          Nearest Facility Finder
        </h2>

        {/* MODE */}
        <div className="mb-4">
          <label className="font-semibold text-sm">Location Mode</label>
          <div className="flex gap-2 mt-2">
            {["current", "village"].map((m) => (
              <button
                key={m}
                onClick={() => setLocationMode(m)}
                className={`px-3 py-1 rounded-full text-sm ${
                  locationMode === m
                    ? "bg-[#005086] text-white"
                    : "bg-gray-200"
                }`}
              >
                {m === "current" ? "Current Location" : "Village"}
              </button>
            ))}
          </div>
        </div>

        {/* DISTRICT */}
        {locationMode === "village" && (
          <>
            <label className="text-sm font-medium">District</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedVillageId("");
              }}
            >
              <option value="">Select District</option>
              {DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <label className="text-sm font-medium">Village</label>
            <select
              className="w-full border rounded px-3 py-2 mb-4"
              disabled={!selectedDistrict}
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
            >
              <option value="">Select Village</option>
              {filteredVillages.map((v) => (
                <option key={v.villageId} value={v.villageId}>
                  {v.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* FACILITIES */}
        <label className="text-sm font-medium">Facilities (Optional)</label>
        <div className="grid grid-cols-2 gap-2 my-3">
          {["OPD", "Emergency", "ICU", "Diagnostics", "Ambulance","General Consultation","Surgery","Maternity"].map((f) => (
            <label key={f} className="text-sm">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(f)}
                onChange={() =>
                  setSelectedFacilities((p) =>
                    p.includes(f) ? p.filter((x) => x !== f) : [...p, f]
                  )
                }
              />{" "}
              {f}
            </label>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={applyFilters}
            className="flex-1 bg-[#005086] text-white py-2 rounded"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="flex-1 border py-2 rounded"
          >
            Clear
          </button>
        </div>
      </aside>

      {/* -------- MAP -------- */}
      <main className="flex-1">
        <MapContainer center={center} zoom={11} style={{ height: "100vh" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Recenter center={center} />

          <Marker position={center} icon={locationMode === "current" ? userIcon : villageIcon}>
            <Popup>
              {locationMode === "current" ? "Your Location" : "Selected Village"}
            </Popup>
          </Marker>

          {hospitals.map((h, i) => (
            <Marker
              key={i}
              icon={hospitalIcons[i]}
              position={[
                h.coordinates?.[1] ?? h.location.coordinates[1],
                h.coordinates?.[0] ?? h.location.coordinates[0],
              ]}
            >
              <Popup>
                <strong>{h.name}</strong>
                <div>District: {h.district}</div>
                <div>Doctors: {h.doctors}</div>
                <div>Beds: {h.beds}</div>
                {h.distanceInKm && <div>{h.distanceInKm} km away</div>}
              </Popup>
            </Marker>
          ))}

          {/* {connections.map((line, i) => (
            <Polyline key={i} positions={line} color="blue" />
          ))} */}
        </MapContainer>
      </main>
    </div>
  );
}
