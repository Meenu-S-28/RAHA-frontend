import { Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const villageIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [26, 26],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [28, 28],
});

export default function VillageHospitalConnections({ data = [] }) {
  return (
    <>
      {data.map((item, idx) => {
        const vLng = item.village.coordinates[0];
        const vLat = item.village.coordinates[1];

        return (
          <div key={idx}>
            <Marker position={[vLat, vLng]} icon={villageIcon}>
              <Popup>
                <strong>{item.village.name}</strong>
                <div>Access Score: {item.village.accessScore?.toFixed(2)}</div>
              </Popup>
            </Marker>

            {item.hospitals.map((h, i) => {
              const hLng = h.coordinates[0];
              const hLat = h.coordinates[1];

              return (
                <div key={i}>
                  <Marker position={[hLat, hLng]} icon={hospitalIcon}>
                    <Popup>
                      <strong>{h.name}</strong>
                      <div>{h.distanceKm?.toFixed(1)} km</div>
                    </Popup>
                  </Marker>

                  <Polyline
                    positions={[
                      [vLat, vLng],
                      [hLat, hLng],
                    ]}
                    color={i === 0 ? "green" : i === 1 ? "orange" : "red"}
                    weight={2}
                    opacity={0.7}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
