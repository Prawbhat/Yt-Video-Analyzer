import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ChannelInputProps {
  onSubmit: (channelInput: string) => void;
  isLoading: boolean;
}

export const ChannelInput = ({ onSubmit, isLoading }: ChannelInputProps) => {
  const [channelInput, setChannelInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channelInput.trim()) {
      onSubmit(channelInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter YouTube channel URL, @username, or channel ID"
          value={channelInput}
          onChange={(e) => setChannelInput(e.target.value)}
          className="flex-1 h-12 text-base"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !channelInput.trim()}
          className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Search className="w-5 h-5 mr-2" />
          {isLoading ? "Fetching..." : "Scrape"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Supports: Channel URLs, @username, or channel IDs
      </p>
    </form>
  );
};
