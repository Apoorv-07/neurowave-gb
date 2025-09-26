"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Target, Clock, Brain, Activity } from "lucide-react"

// Mock data from PRD structure
const modelMetrics = {
  overall_accuracy: 94.7,
  overall_precision: 92.3,
  overall_recall: 91.8,
  overall_f1_score: 92.0,
  processing_time: 2.34,
  inference_time: 2340,
}

const classMetrics = [
  { class_name: "Glioma", precision: 95.2, recall: 93.8, f1_score: 94.5, support: 826 },
  { class_name: "Meningioma", precision: 91.7, recall: 89.2, f1_score: 90.4, support: 822 },
  { class_name: "Pituitary", precision: 93.1, recall: 94.6, f1_score: 93.8, support: 827 },
  { class_name: "No Tumor", precision: 89.8, recall: 89.1, f1_score: 89.4, support: 395 },
]

const modelComparison = [
  { model: "NeuroWave v3", accuracy: 94.7, precision: 92.3, recall: 91.8, f1_score: 92.0, processing_time: 2.34 },
  { model: "NeuroWave v2", accuracy: 91.2, precision: 89.1, recall: 88.7, f1_score: 88.9, processing_time: 3.12 },
  { model: "ResNet-50", accuracy: 87.3, precision: 85.2, recall: 84.9, f1_score: 85.0, processing_time: 4.21 },
  { model: "VGG-16", accuracy: 82.1, precision: 80.3, recall: 79.8, f1_score: 80.0, processing_time: 5.67 },
]

const trainingHistory = [
  { epoch: 1, loss: 1.42, accuracy: 65.2, val_loss: 1.38, val_accuracy: 67.1 },
  { epoch: 5, loss: 0.89, accuracy: 78.4, val_loss: 0.92, val_accuracy: 76.8 },
  { epoch: 10, loss: 0.54, accuracy: 85.7, val_loss: 0.61, val_accuracy: 83.2 },
  { epoch: 15, loss: 0.32, accuracy: 90.1, val_loss: 0.41, val_accuracy: 88.7 },
  { epoch: 20, loss: 0.21, accuracy: 92.8, val_loss: 0.29, val_accuracy: 91.4 },
  { epoch: 25, loss: 0.15, accuracy: 94.2, val_loss: 0.23, val_accuracy: 93.1 },
  { epoch: 30, loss: 0.12, accuracy: 94.7, val_loss: 0.21, val_accuracy: 93.8 },
]

const confusionMatrixData = [
  { predicted: "Glioma", actual: "Glioma", value: 775 },
  { predicted: "Glioma", actual: "Meningioma", value: 12 },
  { predicted: "Glioma", actual: "Pituitary", value: 8 },
  { predicted: "Glioma", actual: "No Tumor", value: 5 },
]

const COLORS = ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981"]

export function PerformanceAnalytics() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="performance" className="py-24 px-6 lg:px-12 relative bg-secondary/20">
      <div className="absolute inset-0 opacity-5">
        <div className="neural-network"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        <div className="fade-in-up text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Model Performance Analytics</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive analysis of our AI model's performance across different tumor classifications with real-time
            metrics and detailed insights.
          </p>
        </div>

        <div className="fade-in-up grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="card-glassmorphism border-primary/20 p-8 hover:border-primary/40 transition-all duration-300 hover:glow-primary">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Overall Accuracy</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">{modelMetrics.overall_accuracy}%</div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <TrendingUp className="w-4 h-4" />
              <span>+2.3% from v2</span>
            </div>
          </Card>

          <Card className="card-glassmorphism border-accent/20 p-8 hover:border-accent/40 transition-all duration-300 hover:glow-accent">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-accent" />
              <span className="text-sm text-muted-foreground font-medium">Precision</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">{modelMetrics.overall_precision}%</div>
            <div className="flex items-center gap-2 text-sm text-accent">
              <TrendingUp className="w-4 h-4" />
              <span>+3.2% from v2</span>
            </div>
          </Card>

          <Card className="card-glassmorphism border-primary/20 p-8 hover:border-primary/40 transition-all duration-300 hover:glow-primary">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">Recall</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">{modelMetrics.overall_recall}%</div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <TrendingUp className="w-4 h-4" />
              <span>+3.1% from v2</span>
            </div>
          </Card>

          <Card className="card-glassmorphism border-accent/20 p-8 hover:border-accent/40 transition-all duration-300 hover:glow-accent">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-accent" />
              <span className="text-sm text-muted-foreground font-medium">F1-Score</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">{modelMetrics.overall_f1_score}%</div>
            <div className="flex items-center gap-2 text-sm text-accent">
              <TrendingUp className="w-4 h-4" />
              <span>+3.1% from v2</span>
            </div>
          </Card>
        </div>

        <div className="fade-in-up">
          <Tabs defaultValue="class-performance" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 card-glassmorphism border-border/30">
              <TabsTrigger
                value="class-performance"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Per-Class Performance
              </TabsTrigger>
              <TabsTrigger
                value="model-comparison"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Model Comparison
              </TabsTrigger>
              <TabsTrigger
                value="training-history"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Training History
              </TabsTrigger>
              <TabsTrigger
                value="confusion-matrix"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Confusion Matrix
              </TabsTrigger>
            </TabsList>

            <TabsContent value="class-performance" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-10">
                <Card className="card-glassmorphism border-primary/20 p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-8">Per-Class Metrics</h3>
                  <div className="space-y-8">
                    {classMetrics.map((metric, index) => (
                      <div key={metric.class_name} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-sm py-2 px-4 border-primary/30">
                            {metric.class_name}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-medium">{metric.support} samples</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-2 font-medium">Precision</div>
                            <div className="font-bold text-foreground text-lg">{metric.precision}%</div>
                            <Progress value={metric.precision} className="h-2 mt-2" />
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-2 font-medium">Recall</div>
                            <div className="font-bold text-foreground text-lg">{metric.recall}%</div>
                            <Progress value={metric.recall} className="h-2 mt-2" />
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-2 font-medium">F1-Score</div>
                            <div className="font-bold text-foreground text-lg">{metric.f1_score}%</div>
                            <Progress value={metric.f1_score} className="h-2 mt-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="card-glassmorphism border-accent/20 p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-8">Performance Distribution</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={classMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="class_name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(12, 12, 24, 0.9)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          backdropFilter: "blur(12px)",
                        }}
                      />
                      <Bar dataKey="precision" fill="oklch(0.7 0.3 264)" name="Precision" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="recall" fill="oklch(0.65 0.25 300)" name="Recall" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="f1_score" fill="oklch(0.6 0.2 180)" name="F1-Score" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="model-comparison" className="space-y-6">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Model Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-muted-foreground">Model</th>
                        <th className="text-right py-3 text-muted-foreground">Accuracy</th>
                        <th className="text-right py-3 text-muted-foreground">Precision</th>
                        <th className="text-right py-3 text-muted-foreground">Recall</th>
                        <th className="text-right py-3 text-muted-foreground">F1-Score</th>
                        <th className="text-right py-3 text-muted-foreground">Processing Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelComparison.map((model, index) => (
                        <tr key={model.model} className="border-b border-border/50">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{model.model}</span>
                              {index === 0 && <Badge className="text-xs">Current</Badge>}
                            </div>
                          </td>
                          <td className="text-right py-4 font-medium text-foreground">{model.accuracy}%</td>
                          <td className="text-right py-4 font-medium text-foreground">{model.precision}%</td>
                          <td className="text-right py-4 font-medium text-foreground">{model.recall}%</td>
                          <td className="text-right py-4 font-medium text-foreground">{model.f1_score}%</td>
                          <td className="text-right py-4 font-medium text-foreground">{model.processing_time}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="training-history" className="space-y-6">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Training Progress</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="epoch" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#6366f1"
                      strokeWidth={2}
                      name="Training Accuracy"
                    />
                    <Line
                      type="monotone"
                      dataKey="val_accuracy"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Validation Accuracy"
                    />
                    <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Training Loss" />
                    <Line type="monotone" dataKey="val_loss" stroke="#f97316" strokeWidth={2} name="Validation Loss" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="confusion-matrix" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="card-gradient border-border/50 p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Classification Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={classMetrics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ class_name, support }) => `${class_name}: ${support}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="support"
                      >
                        {classMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="card-gradient border-border/50 p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Cross-Validation Results</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-muted-foreground">Mean CV Score</span>
                      <span className="text-xl font-bold text-primary">93.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                      <span className="text-muted-foreground">Standard Deviation</span>
                      <span className="text-lg font-semibold text-foreground">±1.8%</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Individual CV Scores</span>
                      {[94.1, 92.8, 93.7, 91.9, 93.5].map((score, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Fold {index + 1}</span>
                          <span className="font-medium text-foreground">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
