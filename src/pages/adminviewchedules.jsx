import { useEffect, useState } from "react";
import API from "@/api/axios";

export default function SchedulesList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSchedules();
  }, [filter]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await API.get("/schedules", {
        params: filter === "all" ? {} : { filter }
      });
      setSchedules(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const renderScheduleCard = (s) => (
    <div
      key={s.id}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 border"
    >
      <h3 className="font-bold">{s.assignment.title}</h3>
      <p><strong>Volunteer:</strong> {s.volunteer.name}</p>
      <p><strong>Date:</strong> {s.schedule_date}</p>
      <p><strong>Time:</strong> {s.start_time} – {s.end_time}</p>
      <p><strong>Location:</strong> {s.location}</p>
      <p><strong>Status:</strong> {s.status}</p>
    </div>
  );

  return (
    <div className="page p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Schedules</h2>

      {/* FILTER */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {loading ? (
        <p>Loading schedules...</p>
      ) : schedules.length === 0 ? (
        <p>No schedules found.</p>
      ) : (
        <div>{schedules.map(renderScheduleCard)}</div>
      )}
    </div>
  );
}
