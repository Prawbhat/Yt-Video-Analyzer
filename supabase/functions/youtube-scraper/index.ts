import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VideoData {
  id: string;
  title: string;
  views: string;
  likes: string;
  comments: string;
  uploadDate: string;
  thumbnail: string;
  url: string;
  duration: string;
  contentType: 'Short Form' | 'Long Form';
  tags: string[];
  hashtags: string[];
  hasCaption: boolean;
}

// Parse ISO 8601 duration format (PT1M30S) to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Format seconds to readable duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { channelInput } = await req.json();
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY');

    if (!API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    console.log('Processing channel input:', channelInput);

    // Extract channel ID from various formats
    let channelId = channelInput;
    
    // Handle full URLs
    if (channelInput.includes('youtube.com') || channelInput.includes('youtu.be')) {
      const url = new URL(channelInput);
      
      // Handle @username format
      if (channelInput.includes('/@')) {
        const username = channelInput.split('/@')[1].split('/')[0];
        console.log('Searching for channel by username:', username);
        
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${username}&key=${API_KEY}`
        );
        const searchData = await searchResponse.json();
        
        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].id;
        } else {
          throw new Error('Channel not found');
        }
      } 
      // Handle /channel/ format
      else if (url.pathname.includes('/channel/')) {
        channelId = url.pathname.split('/channel/')[1].split('/')[0];
      }
      // Handle /c/ or /user/ format
      else if (url.pathname.includes('/c/') || url.pathname.includes('/user/')) {
        const username = url.pathname.split('/')[2];
        console.log('Searching for channel by legacy username:', username);
        
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${API_KEY}`
        );
        const searchData = await searchResponse.json();
        
        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].id;
        } else {
          throw new Error('Channel not found');
        }
      }
    }
    // Handle @username without URL
    else if (channelInput.startsWith('@')) {
      const username = channelInput.substring(1);
      console.log('Searching for channel by handle:', username);
      
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${username}&key=${API_KEY}`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].id;
      } else {
        throw new Error('Channel not found');
      }
    }

    console.log('Final channel ID:', channelId);

    // Get channel's uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
    );
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    console.log('Uploads playlist ID:', uploadsPlaylistId);

    // Fetch all videos from the uploads playlist
    const videos: VideoData[] = [];
    let nextPageToken = '';
    
    do {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`;
      const playlistResponse = await fetch(playlistUrl);
      const playlistData = await playlistResponse.json();

      if (!playlistData.items) {
        break;
      }

      // Get video IDs for this batch
      const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId);
      
      // Fetch detailed statistics and content details for these videos
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds.join(',')}&key=${API_KEY}`;
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();

      // Combine the data
      statsData.items.forEach((video: any) => {
        const durationInSeconds = parseDuration(video.contentDetails.duration);
        const isShortForm = durationInSeconds < 60;
        
        // Extract tags and hashtags
        const tags = video.snippet.tags || [];
        const description = video.snippet.description || '';
        const hashtags = (description.match(/#[\w]+/g) || []).map((tag: string) => tag.substring(1));
        
        videos.push({
          id: video.id,
          title: video.snippet.title,
          views: parseInt(video.statistics.viewCount || '0').toLocaleString(),
          likes: parseInt(video.statistics.likeCount || '0').toLocaleString(),
          comments: video.statistics.commentCount ? parseInt(video.statistics.commentCount).toLocaleString() : 'Disabled',
          uploadDate: new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          thumbnail: video.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          duration: formatDuration(durationInSeconds),
          contentType: isShortForm ? 'Short Form' : 'Long Form',
          tags: tags,
          hashtags: hashtags,
          hasCaption: video.contentDetails.caption === 'true'
        });
      });

      nextPageToken = playlistData.nextPageToken || '';
      console.log(`Fetched ${videos.length} videos so far...`);
      
    } while (nextPageToken);

    console.log(`Total videos fetched: ${videos.length}`);

    return new Response(
      JSON.stringify({ videos, totalVideos: videos.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in youtube-scraper:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
