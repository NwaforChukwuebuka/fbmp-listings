import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Facebook, Package } from "lucide-react";

interface ListingFormProps {
  onListingAdded: () => void;
}

export const ListingForm = ({ onListingAdded }: ListingFormProps) => {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isValidFacebookUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      
      // Check if it's a Facebook domain
      const facebookDomains = [
        'facebook.com',
        'www.facebook.com',
        'm.facebook.com',
        'fb.com',
        'www.fb.com'
      ];
      
      const isFacebookDomain = facebookDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );
      
      if (!isFacebookDomain) {
        return false;
      }
      
      // Accept any Facebook URL - they could be marketplace listings, shares, posts, etc.
      // Facebook's URL structure is complex and can include marketplace listings in various formats
      return true;
      
    } catch (error) {
      // Invalid URL format
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please paste a Facebook URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidFacebookUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid Facebook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("listings")
        .insert([{ 
          link: url.trim(),
          product: product.trim() || null
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Duplicate URL",
            description: "This Facebook URL has already been added",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success!",
        description: "Facebook URL added successfully",
      });

      setUrl("");
      setProduct("");
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
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Enter product name or description..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="pl-12 h-14 text-lg bg-input/90 backdrop-blur-sm border-border/50 rounded-xl shadow-soft focus:shadow-glow transition-all duration-300"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Facebook className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="url"
            placeholder="Paste your Facebook URL here..."
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
              Add Facebook URL
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};