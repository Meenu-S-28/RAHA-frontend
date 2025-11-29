// CampTableView.jsx
import React, { useMemo, useState } from "react";

export default function CampTableView({ camps = [], loading, onViewOnMap }) {
  const [stateFilter, setStateFilter] = useState("All States");
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [search, setSearch] = useState("");

  // derive list of states/districts from camps
  const stateDistrict = useMemo(() => {
    const map = {};
    camps.forEach((c) => {
      const v = c.targetVillageId || {};
      const state = v.state || "Unknown";
      const d = v.district || "Unknown";
      if (!map[state]) map[state] = new Set();
      map[state].add(d);
    });

    const result = {};
    Object.keys(map).forEach((k) => {
      result[k] = ["All Districts", ...Array.from(map[k])];
    });
    return result;
  }, [camps]);

  const stateOptions = ["All States", ...Object.keys(stateDistrict)];
  const districtOptions =
    stateFilter === "All States"
      ? ["All Districts"]
      : stateDistrict[stateFilter] || ["All Districts"];

  // apply filters
  const filtered = camps.filter((c) => {
    const v = c.targetVillageId || {};

    if (
      search &&
      !(v.name || "").toLowerCase().includes(search.toLowerCase())
    )
      return false;

    if (stateFilter !== "All States") {
      const state = v.state || "Unknown";
      if (state !== stateFilter) return false;
    }

    if (districtFilter !== "All Districts") {
      if ((v.district || "") !== districtFilter) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search village name..."
          className="border px-3 py-2 rounded w-64"
        />

        <select
          className="border px-2 py-2 rounded"
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setDistrictFilter("All Districts");
          }}
        >
          {stateOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          className="border px-2 py-2 rounded"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          {districtOptions.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded min-w-full">
        <table className="min-w-[1100px] w-full text-left">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="px-3 py-2">Village</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Population</th>
              <th className="px-3 py-2">Access Score</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Reasons</th>
              <th className="px-3 py-2">Services</th>
              <th className="px-3 py-2">Nearest Hospitals</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => {
              const v = c.targetVillageId || {};
              return (
                <tr key={c._id} className="border-b">
                  <td className="px-3 py-2 align-top">{v.name || "N/A"}</td>
                  <td className="px-3 py-2 align-top">{v.district || "N/A"}</td>
                  <td className="px-3 py-2 align-top">
                    {v.population ?? "N/A"}
                  </td>

                  <td className="px-3 py-2 align-top">
                    {(v.accessScore ?? 0).toFixed
                      ? (v.accessScore ?? 0).toFixed(2)
                      : v.accessScore ?? "N/A"}
                  </td>

                  <td className="px-3 py-2 align-top">
                    {String(c.severityScore ?? "N/A")}
                  </td>

                  <td className="px-3 py-2 align-top text-xs">
                    {(c.reasons || []).join("; ")}
                  </td>

                  <td className="px-3 py-2 align-top text-xs">
                    {(c.servicesRecommended || []).join(", ")}
                  </td>

                  <td className="px-3 py-2 align-top text-xs">
                    {(c.nearestHospitals || [])
                      .map((h) => h.name || h)
                      .join(", ")}
                  </td>

                  <td className="px-3 py-2 align-top">
                    <button
                      onClick={() => onViewOnMap(c._id)}
                      className="text-[#005086] text-sm underline"
                    >
                      View on map
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="p-6 text-center text-gray-500"
                >
                  No recommendations
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
