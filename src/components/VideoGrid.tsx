import { VideoCard } from "./VideoCard";

interface Video {
  id: string;
  title: string;
  views: string;
  likes: string;
  comments: string;
  uploadDate: string;
  thumbnail: string;
  url: string;
}

interface VideoGridProps {
  videos: Video[];
}

export const VideoGrid = ({ videos }: VideoGridProps) => {
  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-card rounded-lg border">
        <h2 className="text-2xl font-bold">
          Total Videos: <span className="text-primary">{videos.length}</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};
