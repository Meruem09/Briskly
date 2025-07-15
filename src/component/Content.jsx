import { useEffect, useState } from "react";
import axios from "axios";

const Content = () => {
  const [topic, setTopic] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btn, setBtn] =useState(false)
  const [error, setError] = useState('');

  // Load topic and videoData from localStorage on mount
  useEffect(() => {
    const savedTopic = localStorage.getItem('searchTopic');
    const savedVideos = localStorage.getItem('videoData');
    if (savedTopic) {
      setTopic(savedTopic);
    }
    if (savedVideos) {
      setVideoData(JSON.parse(savedVideos));
    }
  }, []);

  const handleReset = () => {
    setBtn(false);
    setTopic('');
    setVideoData([])
      localStorage.removeItem('searchTopic');
      localStorage.removeItem('videoData');

  }

  // Save topic and videoData to localStorage only when a new search is performed
  const getVideoRecommendations = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`http://localhost:3000/yt`, {
        params: { topic },
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.data) {
        throw new Error(`Request failed: ${res.status}`);
      }

      console.log('Response:', res.data);
      const newVideos = res.data.videos || [];
      setVideoData(newVideos);
      setBtn(true);
      // Save to localStorage only after a successful search
      localStorage.setItem('searchTopic', topic);
      localStorage.setItem('videoData', JSON.stringify(newVideos));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch videos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg border hover:shadow-[0_0_10px_rgba(90,175,255,0.4)] border-gray-700 p-6 max-w-xl mx-auto mt-8">
      <label htmlFor="topic" className="block text-gray-300 mb-2">Enter a topic:</label>
      <input
        id="topic"
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., Quadratic Equations"
        className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <button
        onClick={getVideoRecommendations}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6 space-y-4">
        {videoData.map((video) => (
          <div
            key={video.videoId}
            className="flex items-center gap-4 bg-gray-800 rounded-lg p-4"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-gray-200 font-semibold">{video.title}</h3>
              <p className="text-gray-400 text-sm">{video.channelTitle}</p>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline text-sm"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>

      {videoData.length === 0 && !loading && !error && (
        <p className="text-gray-400 mt-6 text-center">
          No videos yet. Enter a topic above to get suggestions.
        </p>
      )}
      {btn && (
            <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                Reset
            </button>

      )}

    </div>
  );
};

export default Content;