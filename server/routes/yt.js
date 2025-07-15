import express from 'express';

const router = express.Router();

/**
 * GET /youtube — Get video recommendations for a topic
 * Example: /youtube?topic=Quadratic Equations
 */
router.get('/', async (req, res) => {

  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic parameter' });
  }

  try {
    const YT_API_KEY = process.env.YT_API_KEY;

    if (!YT_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not set in environment' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&q=${encodeURIComponent(topic)}` +
      `&type=video&maxResults=5&key=${YT_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return res.status(500).json({ error: 'Failed to fetch videos from YouTube API' });
    }

    const videos = data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      contentDetails:{
        duration:"PT4M",
      }
    }));

    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({ error: 'Error fetching videos from YouTube API' });
  }
});

export default router;
