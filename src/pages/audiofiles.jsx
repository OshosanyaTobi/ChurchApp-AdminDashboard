import React, { useEffect, useState } from 'react';
import { openUpload } from '@bytescale/upload-widget';
import { useTheme } from '@/hooks/use-theme';
import API from '../api/axios';

const AudioFile = () => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const perPage = 5;

  const uploadAudio = async () => {
    const result = await openUpload({
      apiKey: process.env.REACT_APP_BYTESCALE_KEY,
      maxFileCount: 1,
      mimeTypes: ['audio/upload*'],
    });

    if (!result || result.length === 0) return null;

    return result[0];
  };

  const loadAudio = async () => {
    try {
      const res = await API.getAudio();
      const audioArray = Array.isArray(res.data?.data) ? res.data.data : [];
      setAudio(audioArray);
    } catch (err) {
      console.error(err);
      setAudio([]);
    }
  };

  useEffect(() => {
    loadAudio();
  }, []);

  const submitAudio = async () => {
    if (!title || !audioFile) {
      alert('Title and audio are required');
      return;
    }

    try {
      setLoading(true);

      const audioData = await uploadAudio();
      if (!audioData) {
        alert('Upload failed');
        return;
      }

      await API.post('/audio/upload', {
        title,
        audio_url: audioData.fileUrl,
        file_path: audioData.filePath,
        etag: audioData.etag,
      });

      setTitle('');
      setAudioFile(null);
      await loadAudio();
      alert('Audio published successfully');
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteAudio = async (id) => {
    if (!window.confirm('Are you sure you want to delete this audio?')) return;

    try {
      await API.deleteAudio(id);
      loadAudio();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAudio = Array.isArray(audio)
    ? audio.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  const totalPages = Math.ceil(filteredAudio.length / perPage);
  const paginatedAudio = filteredAudio.slice((page - 1) * perPage, page * perPage);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} p-6 rounded-3xl m-2 md:m-10 mt-24`}>
      
      {/* ===== PAGE TITLE ===== */}
      <h1 className="text-2xl font-bold mb-6">
        Audio Files
      </h1>

      {/* ===== UPLOAD FORM ===== */}
      <div className="space-y-4 mb-6">
        <input
          className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border p-2 rounded w-full`}
          placeholder="Audio Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />

          {audioFile && (
            <span className="text-gray-700 text-sm">
              Selected file: {audioFile.name}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={submitAudio}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          {loading ? 'Publishing...' : 'Publish Audio'}
        </button>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search audio files..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={`${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border p-2 w-full mb-4 rounded`}
      />

      {/* ===== AUDIO LIST ===== */}
      <div className="space-y-4">
        {paginatedAudio.length > 0 ? (
          paginatedAudio.map((s) => (
            <div key={s.id} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border p-4 rounded`}>
              <h3 className="font-bold text-lg">{s.title}</h3>

              {s.audio_url && (
                <audio controls className="mt-3 w-full">
                  <source src={s.audio_url} />
                </audio>
              )}

              <button
                type="button"
                onClick={() => deleteAudio(s.id)}
                className="mt-3 text-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No audio files found.</p>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-1 rounded-full font-semibold transition-colors ${
                page === i + 1
                  ? 'bg-indigo-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
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
};

export default AudioFile;
