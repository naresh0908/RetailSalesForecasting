import { forecastData, modelNames } from "@/data/forecastData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar,
} from "recharts";

const metrics = forecastData.metrics;
const allModels = Object.keys(metrics);

const MetricsTab = () => {
  const mapeData = allModels.map((k) => ({
    model: modelNames[k],
    MAPE: metrics[k as keyof typeof metrics].mape,
  })).sort((a, b) => a.MAPE - b.MAPE);

  const rmseData = allModels.map((k) => ({
    model: modelNames[k],
    RMSE: Math.round(metrics[k as keyof typeof metrics].rmse),
  })).sort((a, b) => a.RMSE - b.RMSE);

  const maeData = allModels.map((k) => ({
    model: modelNames[k],
    MAE: Math.round(metrics[k as keyof typeof metrics].mae),
  })).sort((a, b) => a.MAE - b.MAE);

  // Normalize for radar
  const maxMape = Math.max(...allModels.map((k) => metrics[k as keyof typeof metrics].mape));
  const maxRmse = Math.max(...allModels.map((k) => metrics[k as keyof typeof metrics].rmse));
  const maxMae = Math.max(...allModels.map((k) => metrics[k as keyof typeof metrics].mae));

  const radarData = ["holt_winters", "ma12", "ses_02", "holt"].map((k) => ({
    model: modelNames[k],
    MAPE: Math.round((1 - metrics[k as keyof typeof metrics].mape / maxMape) * 100),
    RMSE: Math.round((1 - metrics[k as keyof typeof metrics].rmse / maxRmse) * 100),
    MAE: Math.round((1 - metrics[k as keyof typeof metrics].mae / maxMae) * 100),
  }));

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Card>
          <CardHeader><CardTitle>Error Metrics Comparison Table</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">MAE ($)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">RMSE ($)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">MAPE (%)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Rank</th>
                </tr>
              </thead>
              <tbody>
                {[...allModels]
                  .sort((a, b) => metrics[a as keyof typeof metrics].mape - metrics[b as keyof typeof metrics].mape)
                  .map((k, i) => {
                    const m = metrics[k as keyof typeof metrics];
                    const isBest = i === 0;
                    return (
                      <tr key={k} className={`border-b border-border ${isBest ? "bg-secondary" : ""}`}>
                        <td className="py-3 px-4 font-medium text-foreground">{isBest ? "🏆 " : ""}{modelNames[k]}</td>
                        <td className="text-right py-3 px-4 text-foreground">${m.mae.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-foreground">${m.rmse.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-foreground">{m.mape}%</td>
                        <td className="text-right py-3 px-4 font-bold text-foreground">#{i + 1}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>MAPE Comparison (%)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mapeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="model" type="category" width={120} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="MAPE" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>RMSE Comparison ($)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rmseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="model" type="category" width={120} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="RMSE" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Model Performance Radar (Higher = Better)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={[
              { metric: "MAPE Score", ...Object.fromEntries(radarData.map(r => [r.model, r.MAPE])) },
              { metric: "RMSE Score", ...Object.fromEntries(radarData.map(r => [r.model, r.RMSE])) },
              { metric: "MAE Score", ...Object.fromEntries(radarData.map(r => [r.model, r.MAE])) },
            ]}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {radarData.map((r, i) => (
                <Radar key={r.model} name={r.model} dataKey={r.model}
                  stroke={["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"][i]}
                  fill={["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"][i]}
                  fillOpacity={0.15} strokeWidth={2} />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsTab;
