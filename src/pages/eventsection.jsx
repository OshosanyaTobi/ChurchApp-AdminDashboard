import React, { useEffect, useState } from 'react';
import { getEvents, createEvent, deleteEvent } from '../api/axios';

function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    venue: '',
    event_date: '',
    image: null,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const perPage = 5;

  /* ===== LOAD EVENTS ===== */
  const load = async () => {
    try {
      const res = await getEvents();
      const eventsArray = Array.isArray(res.data?.data) ? res.data.data : [];

      // ✅ Ensure image URLs are absolute
      const updatedEvents = eventsArray.map((e) => ({
        ...e,
        image: e.image || null,
      }));

      setEvents(updatedEvents);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ===== CREATE EVENT ===== */
  const handleCreate = async () => {
    if (!form.name || !form.venue || !form.event_date) return;

    setLoading(true); // ✅ start animation

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('venue', form.venue);
      formData.append('event_date', form.event_date);
      if (form.image) formData.append('image', form.image);

      await createEvent(formData);

      setForm({ name: '', venue: '', event_date: '', image: null });
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ stop animation
    }
  };

  /* ===== DELETE EVENT ===== */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== FILTER & PAGINATION ===== */
  const filteredEvents = Array.isArray(events)
    ? events.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredEvents.length / perPage);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Events</h2>

      {/* ===== CREATE EVENT FORM ===== */}
      <div className="space-y-2 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Event name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 w-full"
          value={form.event_date}
          onChange={(e) =>
            setForm({ ...form, event_date: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) =>
            setForm({ ...form, venue: e.target.value })
          }
        />

        <button
          type="button"
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={loading} // ✅ disable while loading
        >
          {loading ? 'Creating...' : 'Create Event'} {/* ✅ animation */}
        </button>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset page when searching
        }}
        className="border p-2 w-full mb-4"
      />

      {/* ===== EVENT LIST ===== */}
      {paginatedEvents.length > 0 ? (
        paginatedEvents.map((e) => (
          <div key={e.id} className="border p-4 mb-3 rounded">
            <h4 className="font-bold">{e.name}</h4>
            <p className="text-sm">
              {e.event_date} | {e.venue}
            </p>

            {/* ✅ DISPLAY IMAGE */}
            {e.image && (
              <img
                src={e.image}
                alt={e.name}
                className="mt-2 w-full max-w-sm rounded object-cover"
              />
            )}

            <button
              type="button"
              onClick={() => handleDelete(e.id)}
              className="mt-2 text-red-600"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No events found.</p>
      )}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-black'
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

export default Events;
