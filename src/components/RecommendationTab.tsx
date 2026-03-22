import { forecastData, modelNames } from "@/data/forecastData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown, Target, CheckCircle, XCircle } from "lucide-react";

const metrics = forecastData.metrics;

const RecommendationTab = () => {
  const sorted = Object.keys(metrics).sort(
    (a, b) => metrics[a as keyof typeof metrics].mape - metrics[b as keyof typeof metrics].mape
  );

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const bestM = metrics[best as keyof typeof metrics];
  const worstM = metrics[worst as keyof typeof metrics];

  const modelAnalysis = [
    {
      name: "Moving Average",
      variants: ["ma3", "ma6", "ma12"],
      pros: ["Simple to implement and interpret", "Good baseline model", "MA(12) captures annual patterns"],
      cons: ["Cannot capture trend or seasonality explicitly", "All forecasts converge to a flat line", "Lags behind actual changes"],
    },
    {
      name: "Exponential Smoothing",
      variants: ["ses_02", "ses_05", "ses_08"],
      pros: ["Weights recent data more heavily", "Single parameter to tune", "Low computational cost"],
      cons: ["Produces flat forecasts (no trend/seasonal)", "High α overfits to recent noise", "Not suitable for seasonal data"],
    },
    {
      name: "Holt's Method",
      variants: ["holt"],
      pros: ["Captures the upward trend", "Two-parameter flexibility", "Better than SES for trending data"],
      cons: ["Cannot model seasonality", "Straight-line projection diverges", "Overestimates during low-season months"],
    },
    {
      name: "Holt-Winters",
      variants: ["holt_winters"],
      pros: ["Captures both trend AND seasonality", "Lowest MAPE (18.39%)", "Forecasts follow actual seasonal patterns"],
      cons: ["More complex with 3 parameters", "Needs at least 2 full seasonal cycles", "Can overfit with short training data"],
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-secondary border-2 border-primary">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Trophy className="h-12 w-12 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">🏆 Recommended: Holt-Winters Method</h2>
              <p className="text-muted-foreground mt-2">
                The Holt-Winters (additive) method is the clear winner with a MAPE of just <strong>{bestM.mape}%</strong> — 
                nearly <strong>{Math.round(worstM.mape / bestM.mape)}× better</strong> than the worst model ({modelNames[worst]}).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{bestM.mape}%</p>
            <p className="text-sm text-muted-foreground">Best MAPE</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingDown className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">${bestM.rmse.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Best RMSE</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" style={{ color: "hsl(var(--chart-3))" }} />
            <p className="text-3xl font-bold text-foreground">${bestM.mae.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Best MAE</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Why Holt-Winters Wins</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-foreground">
          <p>The Superstore sales data exhibits <strong>two key characteristics</strong> that determine model choice:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Upward Trend:</strong> Sales grow year-over-year (r=0.50, p&lt;0.001). Models without trend components (MA, SES) cannot capture this growth.</li>
            <li><strong>Strong Seasonality:</strong> Sales peak in Sep/Nov/Dec and dip in Jan/Feb. Only Holt-Winters explicitly models seasonal fluctuations.</li>
          </ol>
          <p>Holt-Winters is the <strong>only model tested that handles both trend and seasonality simultaneously</strong>, which is why it outperforms all others by a wide margin.</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Detailed Model Analysis</h3>
        {modelAnalysis.map((model) => {
          const bestVariant = model.variants.reduce((a, b) =>
            metrics[a as keyof typeof metrics].mape < metrics[b as keyof typeof metrics].mape ? a : b
          );
          const m = metrics[bestVariant as keyof typeof metrics];
          const isWinner = bestVariant === best;

          return (
            <Card key={model.name} className={isWinner ? "border-2 border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isWinner && <Trophy className="h-5 w-5 text-primary" />}
                  {model.name}
                  <span className="text-sm font-normal text-muted-foreground ml-auto">
                    Best MAPE: {m.mape}% | RMSE: ${m.rmse.toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-accent flex items-center gap-1 mb-2">
                      <CheckCircle className="h-4 w-4" /> Strengths
                    </p>
                    <ul className="text-sm space-y-1 text-foreground">
                      {model.pros.map((p) => <li key={p}>• {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-destructive flex items-center gap-1 mb-2">
                      <XCircle className="h-4 w-4" /> Limitations
                    </p>
                    <ul className="text-sm space-y-1 text-foreground">
                      {model.cons.map((c) => <li key={c}>• {c}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Model Ranking Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sorted.map((k, i) => {
              const m = metrics[k as keyof typeof metrics];
              const maxMape = metrics[sorted[sorted.length - 1] as keyof typeof metrics].mape;
              const width = (m.mape / maxMape) * 100;
              return (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-sm font-bold w-6 text-foreground">#{i + 1}</span>
                  <span className="text-sm w-32 truncate text-foreground">{modelNames[k]}</span>
                  <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center px-2 text-xs font-medium text-primary-foreground"
                      style={{
                        width: `${Math.max(width, 15)}%`,
                        backgroundColor: i === 0 ? "hsl(var(--accent))" : "hsl(var(--primary))",
                      }}
                    >
                      {m.mape}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationTab;
