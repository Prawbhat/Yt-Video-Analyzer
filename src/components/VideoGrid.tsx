import { VideoCard } from "./VideoCard";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

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
  const handleDownloadExcel = () => {
    const worksheetData = videos.map((video) => ({
      Title: video.title,
      Views: video.views,
      Likes: video.likes,
      Comments: video.comments,
      "Upload Date": video.uploadDate,
      URL: video.url,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Videos");
    
    XLSX.writeFile(workbook, `youtube-videos-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-card rounded-lg border flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Total Videos: <span className="text-primary">{videos.length}</span>
        </h2>
        <Button onClick={handleDownloadExcel} className="gap-2">
          <Download className="w-4 h-4" />
          Download Excel
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};
