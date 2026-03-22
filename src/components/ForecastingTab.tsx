import { forecastData, modelNames } from "@/data/forecastData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

const fmt = (v: number) => `$${(v / 1000).toFixed(1)}K`;

const colors = {
  actual: "hsl(var(--foreground))",
  ma3: "hsl(var(--primary))",
  ma6: "hsl(var(--accent))",
  ma12: "hsl(var(--chart-3))",
  ses_02: "hsl(var(--primary))",
  ses_05: "hsl(var(--chart-4))",
  ses_08: "hsl(var(--chart-5))",
  holt: "hsl(var(--chart-4))",
  holt_winters: "hsl(var(--accent))",
};

const buildChartData = (keys: string[]) => {
  return forecastData.testDates.map((d, i) => {
    const row: Record<string, number | string> = {
      date: d.slice(0, 7),
      actual: forecastData.testSales[i],
    };
    keys.forEach((k) => {
      row[modelNames[k]] = forecastData.forecasts[k as keyof typeof forecastData.forecasts][i];
    });
    return row;
  });
};

const ForecastChart = ({ title, description, keys }: { title: string; description: string; keys: string[] }) => {
  const data = buildChartData(keys);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke={colors.actual} strokeWidth={3} dot={{ r: 4 }} name="Actual" />
            {keys.map((k) => (
              <Line
                key={k}
                type="monotone"
                dataKey={modelNames[k]}
                stroke={colors[k as keyof typeof colors]}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ForecastingTab = () => (
  <div className="space-y-6">
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          Training data: Jan 2014 – Dec 2016 (36 months) · Test data: Jan 2017 – Dec 2017 (12 months)
        </p>
      </CardContent>
    </Card>

    <ForecastChart
      title="Moving Average Forecasts"
      description="Comparing 3, 6, and 12-month moving average windows. Larger windows produce smoother forecasts."
      keys={["ma3", "ma6", "ma12"]}
    />

    <ForecastChart
      title="Exponential Smoothing Forecasts"
      description="Simple Exponential Smoothing with different α values. SES produces flat forecasts as it has no trend/seasonal component."
      keys={["ses_02", "ses_05", "ses_08"]}
    />

    <ForecastChart
      title="Holt's Method Forecast"
      description="Captures the upward trend but cannot model seasonality, leading to a straight-line forecast."
      keys={["holt"]}
    />

    <ForecastChart
      title="Holt-Winters Method Forecast"
      description="Captures both trend and seasonality. Notice how the forecast follows the seasonal peaks and troughs."
      keys={["holt_winters"]}
    />

    <ForecastChart
      title="All Models Comparison"
      description="Holt-Winters clearly tracks the actual values best, especially during seasonal peaks."
      keys={["ma12", "ses_02", "holt", "holt_winters"]}
    />
  </div>
);

export default ForecastingTab;
