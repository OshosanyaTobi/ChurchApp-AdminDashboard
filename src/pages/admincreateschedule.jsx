import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";

export default function AdminCreateSchedule() {
  const [form, setForm] = useState({
    assignment_id: "",
    volunteer_id: "",
    schedule_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const fetchDependencies = async () => {
    try {
      const [aRes, vRes] = await Promise.all([
        API.getAssignments(),
        API.getVolunteers(),
      ]);

      setAssignments(aRes.data.data);
      setVolunteers(vRes.data.data);
    } catch (err) {
      toast.error("Failed to load assignments or volunteers");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.createSchedule(form);
      toast.success(res.data.message);

      setForm({
        assignment_id: "",
        volunteer_id: "",
        schedule_date: "",
        start_time: "",
        end_time: "",
        location: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Create Schedule</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Assignment */}
        <div>
          <label className="block font-semibold mb-1">Assignment</label>
          <select
            name="assignment_id"
            value={form.assignment_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>

        {/* Volunteer */}
        <div>
          <label className="block font-semibold mb-1">Volunteer</label>
          <select
            name="volunteer_id"
            value={form.volunteer_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select volunteer</option>
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.email})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            name="schedule_date"
            value={form.schedule_date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Main Hall"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}
