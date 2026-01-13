import React, { useEffect, useState } from 'react';
import { openUpload } from '@bytescale/upload-widget';
import Header from '@/components/Header';
import API from '../api/axios';

const AudioFile = () => {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState([]);
  const uploadAudio = async () => {
    const result = await openUpload({
      apiKey: process.env.REACT_APP_BYTESCALE_KEY,
      maxFileCount: 1,
      mimeTypes: ['audio/upload/*'],
    });

    if (!result || result.length === 0) return;

    const { fileUrl, filePath } = result[0];

    console.log('Uploaded:', fileUrl, filePath);
  };

  // ================= Load Sermons =================
  const loadAudio = async () => {
    const res = await API.getAudio();
    setAudio(res.data);
  };

  useEffect(() => {
    loadAudio();
  }, []);

  // ================= Submit Sermon =================
  const submitAudio = async () => {
    if (!title || !audioFile) {
      alert('Title and audio are required');
      return;
    }

    try {
      setLoading(true);

      const audioData = await uploadAudio(audioFile);

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
      console.log(error.response?.data);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };
  const deleteAudio = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sermon?')) return;

    await API.deleteAudio(id);
    loadAudio();
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-6 bg-white rounded-3xl">
      <Header category="Ministry" title="Audio Files" />

      {/* Upload Form */}
      <div className="space-y-4 mb-6">
        <input
          className="border p-2 rounded w-full"
          placeholder="Audio Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
        />

        <button
          type="button"
          onClick={submitAudio}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          {loading ? 'Publishing...' : 'Publish Audio'}
        </button>
      </div>

      {/* Sermon List */}
      <div className="space-y-4">
        {audio.map((s) => (
          <div key={s.id} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{s.title}</h3>

            {s.audio_url && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
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
        ))}
      </div>
    </div>
  );
};

export default AudioFile;