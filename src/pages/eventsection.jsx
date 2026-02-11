import React, { useEffect, useState } from 'react';
import API from '../api/axios';

function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', venue: '', event_date: '', image: null });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 5;

  const load = async () => {
    try {
      const res = await API.getEvents();
      const eventsArray = Array.isArray(res.data?.data) ? res.data.data : [];
      setEvents(eventsArray.map((e) => ({ ...e, image: e.image || null })));
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.venue || !form.event_date) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('venue', form.venue);
      formData.append('event_date', form.event_date);
      if (form.image) formData.append('image', form.image);

      await API.createEvent(formData);
      setForm({ name: '', venue: '', event_date: '', image: null });
      await load();
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await API.deleteEvent(id); await load(); } 
    catch (err) { console.error(err); }
  };

  const filteredEvents = events.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredEvents.length / perPage);
  const paginatedEvents = filteredEvents.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-50">
      <h2 className="text-xl font-bold mb-4">Events</h2>

      <div className="space-y-2 mb-6 p-4 rounded shadow-md bg-white dark:bg-slate-950">
        <input 
          placeholder="Event name" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          className="border p-2 w-full rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />
        <input 
          type="date" 
          value={form.event_date} 
          onChange={(e) => setForm({ ...form, event_date: e.target.value })} 
          className="border p-2 w-full rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />

        <label className="border p-2 w-full rounded cursor-pointer text-gray-700 dark:text-gray-300 text-center bg-white dark:bg-slate-800">
          {form.image ? `Selected: ${form.image.name}` : "Choose image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </label>

        <textarea 
          placeholder="Venue" 
          value={form.venue} 
          onChange={(e) => setForm({ ...form, venue: e.target.value })} 
          className="border p-2 w-full rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />
        <button 
          type="button" 
          onClick={handleCreate} 
          disabled={loading} 
          className={`bg-indigo-600 text-white px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>

      <input 
        type="text" 
        placeholder="Search events..." 
        value={search} 
        onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
        className="border p-2 w-full mb-4 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
      />

      {paginatedEvents.length > 0 ? paginatedEvents.map((e) => (
        <div key={e.id} className="border p-4 mb-3 rounded shadow-md bg-white dark:bg-slate-950">
          <h4 className="font-bold">{e.name}</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">{e.event_date} | {e.venue}</p>
          {e.image && <img src={e.image} alt={e.name} className="mt-2 w-full max-w-sm rounded object-cover" />}
          <button type="button" onClick={() => handleDelete(e.id)} className="mt-2 text-red-600 dark:text-red-400 text-sm">Delete</button>
        </div>
      )) : <p>No events found.</p>}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPage(i + 1)} 
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-50 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
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
