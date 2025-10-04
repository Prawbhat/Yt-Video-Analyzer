import { Card } from "@/components/ui/card";
import { Eye, ThumbsUp, MessageCircle, Calendar, ExternalLink } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  views: string;
  likes: string;
  comments: string;
  uploadDate: string;
  thumbnail: string;
  url: string;
}

export const VideoCard = ({
  title,
  views,
  likes,
  comments,
  uploadDate,
  thumbnail,
  url,
}: VideoCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
            {title}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-primary" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{uploadDate}</span>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
};
