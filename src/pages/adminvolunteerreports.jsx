import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { useTheme } from "@/hooks/use-theme";

export default function AdminVolunteerReports() {
  const { theme } = useTheme();
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reports/volunteers");
      setVolunteers(res.data.data);
    } catch (err) {
      toast.error("Failed to load volunteer reports");
    } finally {
      setLoading(false);
    }
  };

  const containerClass = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  const cardClass = theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300";
  const hoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const tableHeadClass = theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black";
  const tableRowHover = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className={`max-w-6xl mx-auto mt-12 p-6 ${containerClass}`}>
      <h1 className="text-3xl font-bold mb-6">Volunteer Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Volunteer List */}
        <div className={`shadow rounded-md p-4 ${cardClass}`}>
          <h2 className="text-lg font-semibold mb-4">Volunteers</h2>

          {loading ? (
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Loading...</p>
          ) : (
            <ul className="space-y-2 max-h-[500px] overflow-y-auto">
              {volunteers.map((vol) => (
                <li
                  key={vol.id}
                  onClick={() => setSelectedVolunteer(vol)}
                  className={`p-3 rounded cursor-pointer border transition 
                    ${selectedVolunteer?.id === vol.id ? "bg-blue-600 border-blue-500 text-white" : hoverClass} 
                    ${cardClass}`}
                >
                  <p className="font-semibold">{vol.name}</p>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{vol.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Volunteer Report */}
        <div className={`md:col-span-2 shadow rounded-md p-6 ${cardClass}`}>
          {!selectedVolunteer ? (
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
              Select a volunteer to view their report
            </p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{selectedVolunteer.name}</h2>
              <p className={theme === "dark" ? "text-gray-400 mb-4" : "text-gray-600 mb-4"}>
                {selectedVolunteer.email}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-black"}`}>
                  <p className="text-sm text-gray-500">Total Assignments</p>
                  <p className="text-xl font-bold">{selectedVolunteer.total_assignments}</p>
                </div>

                <div className={`p-4 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-black"}`}>
                  <p className="text-sm text-gray-500">Total Hours Worked</p>
                  <p className="text-xl font-bold">{selectedVolunteer.total_hours_worked} hrs</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">Schedule & Availability</h3>

              {selectedVolunteer.availability.length === 0 ? (
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                  No schedules recorded for this volunteer.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border text-sm">
                    <thead className={tableHeadClass}>
                      <tr>
                        <th className="border px-3 py-2 text-left">Date</th>
                        <th className="border px-3 py-2 text-left">Start</th>
                        <th className="border px-3 py-2 text-left">End</th>
                        <th className="border px-3 py-2 text-left">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVolunteer.availability.map((s, index) => (
                        <tr key={index} className={tableRowHover}>
                          <td className="border px-3 py-2">{s.date}</td>
                          <td className="border px-3 py-2">{s.start_time}</td>
                          <td className="border px-3 py-2">{s.end_time}</td>
                          <td className="border px-3 py-2">{s.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
