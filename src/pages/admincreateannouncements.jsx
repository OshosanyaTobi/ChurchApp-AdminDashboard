import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";

export default function AdminAnnouncementsCreate() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("announcement");
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await API.get("/volunteers");
      setVolunteers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load volunteers");
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleVolunteerSelect = (e) => {
    const values = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedVolunteers(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedVolunteers.length === 0) {
      toast.error("Please select at least one volunteer");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/announcements", {
        title,
        message,
        type,
        user_ids: selectedVolunteers,
      });

      toast.success(res.data.message || "Announcement sent successfully");

      // Reset form
      setTitle("");
      setMessage("");
      setType("announcement");
      setSelectedVolunteers([]);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send announcement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">
        Send Announcement / Alert
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g., Sunday Service Update"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="5"
            placeholder="Enter announcement details here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="announcement">Announcement</option>
            <option value="alert">Alert</option>
          </select>
        </div>

        {/* Volunteers */}
        <div>
          <label className="block font-semibold mb-1">
            Select Volunteers
          </label>
          <select
            multiple
            className="w-full border border-gray-300 rounded px-3 py-2 h-40"
            value={selectedVolunteers}
            onChange={handleVolunteerSelect}
          >
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name} ({volunteer.email})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white transition ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
