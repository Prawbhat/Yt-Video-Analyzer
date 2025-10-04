import { useState } from "react";
import { ChannelInput } from "@/components/ChannelInput";
import { VideoGrid } from "@/components/VideoGrid";
import { StatsBar } from "@/components/StatsBar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Youtube } from "lucide-react";

interface Video {
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
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateTotals = (videos: Video[]) => {
    const totalViews = videos.reduce((sum, video) => {
      return sum + parseInt(video.views.replace(/,/g, ''));
    }, 0);

    const totalLikes = videos.reduce((sum, video) => {
      return sum + parseInt(video.likes.replace(/,/g, ''));
    }, 0);

    const totalComments = videos.reduce((sum, video) => {
      if (video.comments === 'Disabled') return sum;
      return sum + parseInt(video.comments.replace(/,/g, ''));
    }, 0);

    return { totalViews, totalLikes, totalComments };
  };

  const handleSubmit = async (channelInput: string) => {
    setIsLoading(true);
    setVideos([]);

    try {
      const { data, error } = await supabase.functions.invoke('youtube-scraper', {
        body: { channelInput }
      });

      if (error) throw error;

      if (data.videos && data.videos.length > 0) {
        setVideos(data.videos);
        toast({
          title: "Success!",
          description: `Fetched ${data.videos.length} videos from the channel.`,
        });
      } else {
        toast({
          title: "No videos found",
          description: "This channel doesn't have any videos yet.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch channel data. Please check the channel ID/URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { totalViews, totalLikes, totalComments } = videos.length > 0 
    ? calculateTotals(videos)
    : { totalViews: 0, totalLikes: 0, totalComments: 0 };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg">
            <Youtube className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YouTube Channel Scraper
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract comprehensive video data from any YouTube channel instantly
          </p>
        </div>

        <ChannelInput onSubmit={handleSubmit} isLoading={isLoading} />

        {isLoading && (
          <div className="flex items-center justify-center my-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        )}

        {videos.length > 0 && !isLoading && (
          <div className="mt-12">
            <StatsBar 
              totalVideos={videos.length}
              totalViews={totalViews}
              totalLikes={totalLikes}
              totalComments={totalComments}
            />
            <VideoGrid videos={videos} />
          </div>
        )}

        {videos.length === 0 && !isLoading && (
          <div className="text-center mt-20 text-muted-foreground">
            <Youtube className="w-24 h-24 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Enter a channel URL or ID to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
