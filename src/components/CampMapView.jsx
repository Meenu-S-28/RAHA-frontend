// CampMapView.jsx
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// simple icon for camp marker
const campIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [28, 28],
});

// user marker icon
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// small helper to compute color by access score (0..1)
function colorForAccessScore(score) {
  // clamp
  const s = Math.max(0, Math.min(1, Number(score ?? 0)));
  if (s < 0.25) return "#b91c1c"; // red
  if (s < 0.5) return "#f97316"; // orange
  if (s < 0.75) return "#facc15"; // yellow
  return "#10A245"; // green
}

// severity -> radius (meters)
function radiusForSeverity(sev) {
  const s = Math.max(0, Number(sev ?? 0));
  // scale: 1 -> 8000m, 0.6 -> 6000, 0.2 -> 2000. Tweak as you want.
  return Math.max(600, s * 8000);
}

// small component to recenter the map given coords
function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center)) {
      map.flyTo(center, Math.max(map.getZoom(), 9), { duration: 0.7 });
    }
  }, [center]);
  return null;
}

const CampMapView = forwardRef(function CampMapView({ camps = [], loading, focusCampId, onUpdate }, ref) {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const [openPopupFor, setOpenPopupFor] = useState(null);

  // initial geolocation (non-blocking)
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation([11.0168, 76.9558]); // fallback Coimbatore
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => setUserLocation([p.coords.latitude, p.coords.longitude]),
      () => setUserLocation([11.0168, 76.9558]),
      { timeout: 8000 }
    );
  }, []);

  // imperative handle so parent can call focusCamp(id)
  useImperativeHandle(ref, () => ({
    focusCamp(id) {
      const camp = camps.find((c) => (c._id || c.id) === id);
      if (!camp) return;
      const v = camp.targetVillageId || {};
      const coords = v.location?.coordinates || v.coordinates || [];
      const lng = coords[0], lat = coords[1];
      if (!lat || !lng) return;
      // center and open popup
      const map = mapRef.current;
      if (map) {
        map.setView([lat, lng], 12, { animate: true });
        // set openPopupFor to camp._id which TableView will trigger popup rendering logic
        setOpenPopupFor(camp._id || camp.id);
        // clear open after some seconds so it doesn't persist
        setTimeout(() => setOpenPopupFor(null), 5000);
      }
    },
  }));

  // when focusCampId prop changes, call internal focus
  useEffect(() => {
    if (focusCampId && ref?.current?.focusCamp) {
      ref.current.focusCamp(focusCampId);
    }
  }, [focusCampId]);

  // update status helper (PUT)
  async function updateStatus(campId, newStatus) {
    try {
      await axios.put(`http://localhost:5000/api/camps/${campId}`, { status: newStatus });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to update camp status", err);
    }
  }

  // map center
  const center = userLocation || (camps[0] && camps[0].targetVillageId?.location?.coordinates ? [camps[0].targetVillageId.location.coordinates[1], camps[0].targetVillageId.location.coordinates[0]] : [11.0168, 76.9558]);

  return (
    <MapContainer
      center={center}
      zoom={9}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter center={center} />

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Village access score colouring (CircleMarker) */}
      {camps.map((camp) => {
        const v = camp.targetVillageId || {};
        const coords = v.location?.coordinates || [];
        const lng = coords[0], lat = coords[1];
        if (!lat || !lng) return null;
        const accessScore = v.accessScore ?? v.accessibility ?? 0; // fallback names
        const color = colorForAccessScore(accessScore);

        return (
          <CircleMarker
            key={`v-${camp._id}`}
            center={[lat, lng]}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.25, weight: 1 }}
            radius={18}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-[#005086]">{v.name || "Village"}</strong>
                <div className="text-xs text-gray-600">District: {v.district || "N/A"}</div>
                <div className="text-xs text-gray-700">Access score: {Number(accessScore).toFixed(2)}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Camp markers + severity circles */}
      {camps.map((camp) => {
        const v = camp.targetVillageId || {};
        const coords = v.location?.coordinates || [];
        const lng = coords[0], lat = coords[1];
        if (!lat || !lng) return null;
        const sev = camp.severityScore ?? 0;
        const circleRadius = radiusForSeverity(sev);
        const severityColor = sev >= 0.9 ? "#7f1d1d" : sev >= 0.6 ? "#b91c1c" : sev >= 0.4 ? "#f97316" : "#facc15";

        return (
          <React.Fragment key={`camp-${camp._id}`}>
            {/* large translucent circle showing severity */}
            <Circle
              center={[lat, lng]}
              radius={circleRadius}
              pathOptions={{ color: severityColor, fillColor: severityColor, fillOpacity: 0.06, weight: 1 }}
            />

            {/* marker to click */}
            <Marker position={[lat, lng]} icon={campIcon} eventHandlers={{
              click: () => setOpenPopupFor(camp._id),
            }}>
              <Popup>
                <div className="text-sm">
                  <strong className="text-[#005086]">{v.name || "Village"}</strong>
                  <div className="text-xs text-gray-600">Severity: {String(camp.severityScore ?? 0)}</div>
                  <div className="text-xs text-gray-700 mt-1">Reasons: {(camp.reasons || []).slice(0,3).join("; ") || "N/A"}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => updateStatus(camp._id, "Approved")}
                      className="bg-[#10A245] text-white text-xs px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(camp._id, "Completed")}
                      className="bg-[#005086] text-white text-xs px-2 py-1 rounded"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
});

export default CampMapView;
