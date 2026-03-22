import { forecastData, monthLabels } from "@/data/forecastData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, ReferenceLine,
} from "recharts";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

const fmt = (v: number) => `$${(v / 1000).toFixed(1)}K`;

const StationarityTab = () => {
  const timeSeriesData = forecastData.dates.map((d, i) => ({
    date: d.slice(0, 7),
    sales: forecastData.sales[i],
    rollingMean: forecastData.rollingMean[i],
    rollingStd: forecastData.rollingStd[i],
  }));

  const seasonalData = monthLabels.map((m, i) => ({
    month: m,
    factor: forecastData.seasonalFactors[i],
  }));

  const isTrending = forecastData.trendPValue < 0.05;
  const hasSeasonal = Math.max(...forecastData.seasonalFactors) - Math.min(...forecastData.seasonalFactors) > 0.5;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--primary))" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className="text-xl font-bold text-foreground">
                  {isTrending ? "Upward Trend Detected" : "No Significant Trend"}
                </p>
                <p className="text-xs text-muted-foreground">r = {forecastData.trendCorrelation}, p = {forecastData.trendPValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--accent))" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Seasonality</p>
                <p className="text-xl font-bold text-foreground">
                  {hasSeasonal ? "Strong Seasonal Pattern" : "Weak Seasonality"}
                </p>
                <p className="text-xs text-muted-foreground">Peak months: Sep, Nov, Dec</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--chart-3))" }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8" style={{ color: "hsl(var(--chart-3))" }} />
              <div>
                <p className="text-sm text-muted-foreground">Stationarity</p>
                <p className="text-xl font-bold text-foreground">Non-Stationary</p>
                <p className="text-xs text-muted-foreground">Trend + seasonality present</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Monthly Sales with Rolling Statistics (12-month window)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={5} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Actual Sales" />
              <Line type="monotone" dataKey="rollingMean" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Rolling Mean" />
              <Line type="monotone" dataKey="rollingStd" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Rolling Std Dev" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Seasonal Factors by Month</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <ReferenceLine y={1} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Baseline" />
              <Bar dataKey="factor" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Seasonal Factor" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-2">
            Values above 1.0 indicate above-average months. September, November, and December show the strongest seasonal peaks.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Analysis Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground">
          <p><strong>Trend:</strong> A statistically significant upward trend (r=0.50, p&lt;0.001) confirms the series is non-stationary. Sales are growing over time.</p>
          <p><strong>Seasonality:</strong> Strong seasonal patterns with peaks in Sep, Nov, Dec (holiday/year-end effects) and troughs in Jan, Feb (post-holiday dip).</p>
          <p><strong>Conclusion:</strong> The series is <strong>non-stationary with both trend and seasonal components</strong>. This means simple models (Moving Average, SES) will struggle, while Holt-Winters should perform best as it captures both trend and seasonality.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StationarityTab;
