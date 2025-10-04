import { Card } from "@/components/ui/card";
import { Eye, ThumbsUp, MessageCircle, Video } from "lucide-react";

interface StatsBarProps {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export const StatsBar = ({ totalVideos, totalViews, totalLikes, totalComments }: StatsBarProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Video className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Videos</p>
            <p className="text-2xl font-bold">{totalVideos}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold">{formatNumber(totalViews)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <ThumbsUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Likes</p>
            <p className="text-2xl font-bold">{formatNumber(totalLikes)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Comments</p>
            <p className="text-2xl font-bold">{formatNumber(totalComments)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
