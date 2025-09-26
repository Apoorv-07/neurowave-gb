"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity, Download } from "lucide-react"

// Enhanced data for advanced visualizations
const rocCurveData = [
  { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
  { fpr: 0.02, tpr: 0.15, threshold: 0.9 },
  { fpr: 0.05, tpr: 0.35, threshold: 0.8 },
  { fpr: 0.08, tpr: 0.55, threshold: 0.7 },
  { fpr: 0.12, tpr: 0.72, threshold: 0.6 },
  { fpr: 0.18, tpr: 0.85, threshold: 0.5 },
  { fpr: 0.25, tpr: 0.92, threshold: 0.4 },
  { fpr: 0.35, tpr: 0.96, threshold: 0.3 },
  { fpr: 0.48, tpr: 0.98, threshold: 0.2 },
  { fpr: 0.65, tpr: 0.99, threshold: 0.1 },
  { fpr: 1.0, tpr: 1.0, threshold: 0.0 },
]

const precisionRecallData = [
  { recall: 0.0, precision: 1.0 },
  { recall: 0.1, precision: 0.98 },
  { recall: 0.2, precision: 0.96 },
  { recall: 0.3, precision: 0.94 },
  { recall: 0.4, precision: 0.92 },
  { recall: 0.5, precision: 0.9 },
  { recall: 0.6, precision: 0.87 },
  { recall: 0.7, precision: 0.84 },
  { recall: 0.8, precision: 0.8 },
  { recall: 0.9, precision: 0.75 },
  { recall: 1.0, precision: 0.68 },
]

const confusionMatrixData = [
  { actual: "Glioma", predicted: "Glioma", value: 775, percentage: 93.8 },
  { actual: "Glioma", predicted: "Meningioma", value: 12, percentage: 1.5 },
  { actual: "Glioma", predicted: "Pituitary", value: 8, percentage: 1.0 },
  { actual: "Glioma", predicted: "No Tumor", value: 5, percentage: 0.6 },
  { actual: "Meningioma", predicted: "Glioma", value: 18, percentage: 2.2 },
  { actual: "Meningioma", predicted: "Meningioma", value: 733, percentage: 89.2 },
  { actual: "Meningioma", predicted: "Pituitary", value: 15, percentage: 1.8 },
  { actual: "Meningioma", predicted: "No Tumor", value: 6, percentage: 0.7 },
  { actual: "Pituitary", predicted: "Glioma", value: 9, percentage: 1.1 },
  { actual: "Pituitary", predicted: "Meningioma", value: 11, percentage: 1.3 },
  { actual: "Pituitary", predicted: "Pituitary", value: 782, percentage: 94.6 },
  { actual: "Pituitary", predicted: "No Tumor", value: 7, percentage: 0.8 },
  { actual: "No Tumor", predicted: "Glioma", value: 4, percentage: 1.0 },
  { actual: "No Tumor", predicted: "Meningioma", value: 8, percentage: 2.0 },
  { actual: "No Tumor", predicted: "Pituitary", value: 12, percentage: 3.0 },
  { actual: "No Tumor", predicted: "No Tumor", value: 352, percentage: 89.1 },
]

const performanceRadarData = [
  { metric: "Accuracy", value: 94.7, fullMark: 100 },
  { metric: "Precision", value: 92.3, fullMark: 100 },
  { metric: "Recall", value: 91.8, fullMark: 100 },
  { metric: "F1-Score", value: 92.0, fullMark: 100 },
  { metric: "Specificity", value: 96.2, fullMark: 100 },
  { metric: "AUC", value: 97.8, fullMark: 100 },
]

const realTimeMetrics = [
  { timestamp: "00:00", accuracy: 94.2, throughput: 45, latency: 2.1 },
  { timestamp: "00:05", accuracy: 94.5, throughput: 48, latency: 2.0 },
  { timestamp: "00:10", accuracy: 94.7, throughput: 52, latency: 1.9 },
  { timestamp: "00:15", accuracy: 94.3, throughput: 47, latency: 2.2 },
  { timestamp: "00:20", accuracy: 94.8, throughput: 51, latency: 1.8 },
  { timestamp: "00:25", accuracy: 94.6, throughput: 49, latency: 2.0 },
  { timestamp: "00:30", accuracy: 94.9, throughput: 53, latency: 1.7 },
]

const COLORS = ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

export function AdvancedCharts() {
  const downloadChart = (chartName: string) => {
    // Simulate chart download functionality
    console.log(`Downloading ${chartName} chart...`)
  }

  return (
    <section className="py-20 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Advanced Analytics Dashboard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive data visualizations and real-time monitoring of model performance metrics
          </p>
        </div>

        <Tabs defaultValue="roc-curves" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="roc-curves">ROC Analysis</TabsTrigger>
            <TabsTrigger value="confusion-matrix">Confusion Matrix</TabsTrigger>
            <TabsTrigger value="performance-radar">Performance Radar</TabsTrigger>
            <TabsTrigger value="real-time">Real-time Metrics</TabsTrigger>
            <TabsTrigger value="distribution">Data Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="roc-curves" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    ROC Curve Analysis
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => downloadChart("ROC Curve")}>
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={rocCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="fpr"
                      stroke="#9ca3af"
                      label={{ value: "False Positive Rate", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        `${(Number(value) * 100).toFixed(1)}%`,
                        name === "tpr" ? "True Positive Rate" : "False Positive Rate",
                      ]}
                    />
                    <Line type="monotone" dataKey="tpr" stroke="#6366f1" strokeWidth={3} dot={false} />
                    <ReferenceLine x={0} y={0} stroke="#9ca3af" strokeDasharray="2 2" />
                    <ReferenceLine x={1} y={1} stroke="#9ca3af" strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <Badge className="text-sm">AUC: 0.978</Badge>
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Precision-Recall Curve
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => downloadChart("Precision-Recall")}>
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={precisionRecallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="recall"
                      stroke="#9ca3af"
                      label={{ value: "Recall", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis stroke="#9ca3af" label={{ value: "Precision", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, "Precision"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="precision"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="text-sm">
                    Average Precision: 0.892
                  </Badge>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="confusion-matrix" className="space-y-6">
            <Card className="card-gradient border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Confusion Matrix Heatmap
                </h3>
                <Button variant="outline" size="sm" onClick={() => downloadChart("Confusion Matrix")}>
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
                <div></div>
                <div className="text-center text-sm font-medium text-muted-foreground p-2">Glioma</div>
                <div className="text-center text-sm font-medium text-muted-foreground p-2">Meningioma</div>
                <div className="text-center text-sm font-medium text-muted-foreground p-2">Pituitary</div>
                <div className="text-center text-sm font-medium text-muted-foreground p-2">No Tumor</div>

                {["Glioma", "Meningioma", "Pituitary", "No Tumor"].map((actualClass, rowIndex) => (
                  <>
                    <div
                      key={`label-${actualClass}`}
                      className="text-sm font-medium text-muted-foreground p-2 flex items-center justify-end"
                    >
                      {actualClass}
                    </div>
                    {["Glioma", "Meningioma", "Pituitary", "No Tumor"].map((predictedClass, colIndex) => {
                      const cellData = confusionMatrixData.find(
                        (item) => item.actual === actualClass && item.predicted === predictedClass,
                      )
                      const isCorrect = actualClass === predictedClass
                      const intensity = cellData ? cellData.percentage / 100 : 0

                      return (
                        <div
                          key={`${actualClass}-${predictedClass}`}
                          className={`p-3 rounded text-center text-sm font-medium transition-all hover:scale-105 ${
                            isCorrect ? `bg-primary text-primary-foreground` : `bg-secondary text-secondary-foreground`
                          }`}
                          style={{
                            opacity: isCorrect ? 1 : 0.3 + intensity * 0.7,
                          }}
                        >
                          <div className="font-bold">{cellData?.value || 0}</div>
                          <div className="text-xs opacity-75">{cellData?.percentage.toFixed(1)}%</div>
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance-radar" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Performance Radar Chart
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => downloadChart("Performance Radar")}>
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={performanceRadarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      tickCount={6}
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value}%`, "Score"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-accent" />
                  Class Distribution
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Glioma", value: 3264, percentage: 21.2 },
                        { name: "Meningioma", value: 4621, percentage: 30.0 },
                        { name: "Pituitary", value: 3762, percentage: 24.4 },
                        { name: "No Tumor", value: 3773, percentage: 24.5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="real-time" className="space-y-6">
            <Card className="card-gradient border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Real-time Performance Monitoring
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={realTimeMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="throughput"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="Throughput (req/min)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="latency"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Latency (s)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Confidence Score Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { range: "0-20%", count: 45 },
                      { range: "20-40%", count: 123 },
                      { range: "40-60%", count: 287 },
                      { range: "60-80%", count: 892 },
                      { range: "80-90%", count: 1456 },
                      { range: "90-100%", count: 2197 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="range" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Processing Time Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    data={[
                      { size: 1.2, accuracy: 89.2 },
                      { size: 1.8, accuracy: 91.5 },
                      { size: 2.1, accuracy: 93.1 },
                      { size: 2.4, accuracy: 94.7 },
                      { size: 2.8, accuracy: 94.2 },
                      { size: 3.2, accuracy: 93.8 },
                      { size: 3.6, accuracy: 92.9 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="size"
                      stroke="#9ca3af"
                      label={{ value: "Processing Time (s)", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      dataKey="accuracy"
                      stroke="#9ca3af"
                      label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Scatter dataKey="accuracy" fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
