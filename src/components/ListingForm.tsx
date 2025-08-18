import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Facebook } from "lucide-react";

interface ListingFormProps {
  onListingAdded: () => void;
}

export const ListingForm = ({ onListingAdded }: ListingFormProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isValidFacebookUrl = (url: string) => {
    const facebookPatterns = [
      /^https?:\/\/(www\.)?facebook\.com\/marketplace/,
      /^https?:\/\/(www\.)?facebook\.com\/.*\/marketplace/,
    ];
    return facebookPatterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please paste a Facebook Marketplace URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidFacebookUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid Facebook Marketplace URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("listings")
        .insert([{ link: url.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Duplicate Listing",
            description: "This Facebook Marketplace URL has already been added",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success!",
        description: "Facebook Marketplace listing added successfully",
      });

      setUrl("");
      onListingAdded();
    } catch (error) {
      console.error("Error adding listing:", error);
      toast({
        title: "Error",
        description: "Failed to add listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Facebook className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="url"
            placeholder="Paste your Facebook Marketplace listing URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-12 h-14 text-lg bg-input/90 backdrop-blur-sm border-border/50 rounded-xl shadow-soft focus:shadow-glow transition-all duration-300"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 animate-glow"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Adding listing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add FBMP Listing
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};