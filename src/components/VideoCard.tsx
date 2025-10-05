import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp, MessageCircle, Calendar, ExternalLink, Clock, Tag, Hash, FileText } from "lucide-react";
import { toast } from "sonner";

interface VideoCardProps {
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

export const VideoCard = ({
  id,
  title,
  views,
  likes,
  comments,
  uploadDate,
  thumbnail,
  url,
  duration,
  contentType,
  tags,
  hashtags,
  hasCaption,
}: VideoCardProps) => {
  const handleTranscriptRequest = () => {
    toast.info("YouTube API limits caption downloads to OAuth-authenticated apps. You can view captions directly on YouTube by clicking the video link.");
  };
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge 
            variant={contentType === 'Short Form' ? 'destructive' : 'secondary'}
            className="absolute bottom-2 right-2 font-semibold"
          >
            {contentType}
          </Badge>
          <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
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
          
          {(tags.length > 0 || hashtags.length > 0) && (
            <div className="space-y-2">
              {tags.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {hashtags.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {hashtags.slice(0, 3).map((hashtag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                    {hashtags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hashtags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {hasCaption && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleTranscriptRequest();
              }}
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <FileText className="w-4 h-4" />
              View Transcript Info
            </Button>
          )}
        </div>
      </a>
    </Card>
  );
};
