import { useEffect, useState } from "react";
import API from "../api/axios";

export default function WatchSection() {
  const [watchsection, setWatchSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    video_link: "",
    image: null,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 5;

  // ================= LOAD WATCH ITEMS =================
  const loadWatchSection = async () => {
    setLoading(true);
    try {
      const res = await API.get("/watch-sections");
      const data = Array.isArray(res.data?.data) ? res.data.data : res.data || [];
      setWatchSection(data);
    } catch (err) {
      console.error(err);
      setWatchSection([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchSection();
  }, []);

  // ================= CREATE WATCH ITEM =================
  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("video_link", form.video_link);
    if (form.image) formData.append("image", form.image);

    try {
      await API.post("/watch-sections", formData);
      setForm({ title: "", description: "", video_link: "", image: null });
      setPage(1);
      await loadWatchSection();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE WATCH ITEM =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this watch item?")) return;

    try {
      await API.delete(`/watch-sections/${id}`);
      await loadWatchSection();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER & PAGINATION =================
  const filteredItems = Array.isArray(watchsection)
    ? watchsection.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredItems.length / perPage);
  const paginatedItems = filteredItems.slice((page - 1) * perPage, page * perPage);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Watch Section</h2>

      {/* ===== FORM ===== */}
      <div className="space-y-3 mb-6">
        <input
          className="border p-2 w-full rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Video link (YouTube / Vimeo)"
          value={form.video_link}
          onChange={(e) => setForm({ ...form, video_link: e.target.value })}
        />

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full rounded"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          {form.image && (
            <span className="text-gray-700 text-sm">
              Selected: {form.image.name}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create Watch Item
        </button>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search watch items..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 w-full mb-4 rounded"
      />

      {/* ===== WATCH ITEMS LIST ===== */}
      <div className="space-y-4">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded shadow-sm"
            >
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm mt-1">{item.description}</p>

              {item.video_link && (
                <a
                  href={item.video_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 text-sm block mt-2"
                >
                  Watch Video
                </a>
              )}

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="mt-2 w-full max-w-sm rounded"
                />
              )}

              <button
                onClick={() => handleDelete(item.id)}
                className="mt-3 text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No watch items found.</p>
        )}
      </div>

      {/* ===== PAGINATION (PILLS) ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-1 rounded-full font-semibold transition-colors ${
                page === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
