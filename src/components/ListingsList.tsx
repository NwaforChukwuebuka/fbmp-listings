import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Link as LinkIcon, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  link: string;
  status: number;
  created_at: string;
  updated_at: string;
  product: string | null;
}

interface ListingsListProps {
  refreshTrigger: number;
}

export const ListingsList = ({ refreshTrigger }: ListingsListProps) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { data, error } = await supabase
        .from("listings")
        .select("id", { count: "exact" })
        .gte("created_at", `${today}T00:00:00.000Z`)
        .lt("created_at", `${today}T23:59:59.999Z`);

      if (error) throw error;
      setTodayCount(data?.length || 0);
    } catch (error) {
      console.error("Error fetching daily stats:", error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchTodayStats();
  }, [refreshTrigger]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"></Badge>;
      case 1:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const extractListingTitle = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1]?.replace(/-/g, ' ') || 'Facebook Marketplace Listing';
    } catch {
      return 'Facebook Marketplace Listing';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
        <p className="text-muted-foreground">Add your first Facebook Marketplace listing above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Recent FBMP Listings ({listings.length}/5)</h2>
        <div className="flex items-center gap-3 text-right">
          <div className="text-2xl font-bold text-white">{todayCount}</div>
          <div className="flex flex-col">
            <span className="text-sm text-white">today</span>
            <span className="text-xs text-white">listings</span>
          </div>
          {todayCount > 0 && (
            <TrendingUp className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>
      {listings.map((listing) => (
        <Card key={listing.id} className="group hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {listing.product && (
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {listing.product}
                  </h3>
                )}
                <p className="text-muted-foreground text-sm mb-3 break-all line-clamp-2">
                  {listing.link}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(listing.created_at)}
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <a
                  href={listing.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};