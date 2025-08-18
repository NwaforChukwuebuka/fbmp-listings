import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DailyStatsProps {
  refreshTrigger: number;
}

export const DailyStats = ({ refreshTrigger }: DailyStatsProps) => {
  const [todayCount, setTodayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStats();
  }, [refreshTrigger]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-primary">{todayCount}</div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">listings added</span>
            <span className="text-xs text-muted-foreground">{formatDate(new Date())}</span>
          </div>
          {todayCount > 0 && (
            <div className="ml-auto">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};