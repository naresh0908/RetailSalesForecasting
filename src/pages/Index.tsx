import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StationarityTab from "@/components/StationarityTab";
import ForecastingTab from "@/components/ForecastingTab";
import MetricsTab from "@/components/MetricsTab";
import RecommendationTab from "@/components/RecommendationTab";
import { Activity, LineChart, BarChart3, Trophy } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-5">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          📊 Time Series Forecasting Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Superstore Monthly Sales Analysis · Jan 2014 – Dec 2017
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="stationarity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="stationarity" className="flex items-center gap-2 text-xs sm:text-sm">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Stationarity</span>
              <span className="sm:hidden">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2 text-xs sm:text-sm">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Forecasting</span>
              <span className="sm:hidden">Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="flex items-center gap-2 text-xs sm:text-sm">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendation</span>
              <span className="sm:hidden">Best</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stationarity"><StationarityTab /></TabsContent>
          <TabsContent value="forecasting"><ForecastingTab /></TabsContent>
          <TabsContent value="metrics"><MetricsTab /></TabsContent>
          <TabsContent value="recommendation"><RecommendationTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
