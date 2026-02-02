import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";

export default function AdminVolunteerReports() {
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

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold mb-6">Volunteer Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Volunteer List */}
        <div className="bg-white shadow rounded-md p-4">
          <h2 className="text-lg font-semibold mb-4">Volunteers</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <ul className="space-y-2 max-h-[500px] overflow-y-auto">
              {volunteers.map((vol) => (
                <li
                  key={vol.id}
                  onClick={() => setSelectedVolunteer(vol)}
                  className={`p-3 rounded cursor-pointer border transition ${
                    selectedVolunteer?.id === vol.id
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold">{vol.name}</p>
                  <p className="text-sm text-gray-500">{vol.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Volunteer Report */}
        <div className="md:col-span-2 bg-white shadow rounded-md p-6">
          {!selectedVolunteer ? (
            <p className="text-gray-500">
              Select a volunteer to view their report
            </p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">
                {selectedVolunteer.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedVolunteer.email}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Total Assignments</p>
                  <p className="text-xl font-bold">
                    {selectedVolunteer.total_assignments}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Total Hours Worked</p>
                  <p className="text-xl font-bold">
                    {selectedVolunteer.total_hours_worked} hrs
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Schedule & Availability
              </h3>

              {selectedVolunteer.availability.length === 0 ? (
                <p className="text-gray-500">
                  No schedules recorded for this volunteer.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2 text-left">Date</th>
                        <th className="border px-3 py-2 text-left">Start</th>
                        <th className="border px-3 py-2 text-left">End</th>
                        <th className="border px-3 py-2 text-left">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVolunteer.availability.map((s, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">
                            {s.date}
                          </td>
                          <td className="border px-3 py-2">
                            {s.start_time}
                          </td>
                          <td className="border px-3 py-2">
                            {s.end_time}
                          </td>
                          <td className="border px-3 py-2">
                            {s.location}
                          </td>
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
