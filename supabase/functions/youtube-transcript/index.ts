import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, videoTitle } = await req.json();
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY');

    if (!API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    console.log('Fetching transcript for video:', videoId);

    // Get caption tracks for the video
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${API_KEY}`
    );
    const captionsData = await captionsResponse.json();

    if (!captionsData.items || captionsData.items.length === 0) {
      throw new Error('No captions available for this video');
    }

    // Find English caption track (or first available)
    const captionTrack = captionsData.items.find((track: any) => 
      track.snippet.language === 'en' || track.snippet.language === 'en-US'
    ) || captionsData.items[0];

    console.log('Found caption track:', captionTrack.id);

    // Note: Downloading caption content requires OAuth 2.0 authentication
    // The YouTube Data API v3 doesn't allow downloading captions with just API key
    // We'll return the caption track info and let the user know they need to download manually
    
    return new Response(
      JSON.stringify({ 
        captionId: captionTrack.id,
        language: captionTrack.snippet.language,
        trackKind: captionTrack.snippet.trackKind,
        message: 'Caption track found. Note: Downloading captions requires OAuth authentication which is not available with API key only. You can view captions directly on YouTube.',
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in youtube-transcript:', error);
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
