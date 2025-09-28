"use client"

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
  overall_accuracy: 97.94,
  overall_precision: 98.0,
  overall_recall: 98.0,
  overall_f1_score: 98.0,
  processing_time: 12.26,
  inference_time: 2340, // This value is not in the provided images
};

const classMetrics = [
  { class_name: "Glioma", precision: 100.0, recall: 98.0, f1_score: 99.0, support: 300 },
  { class_name: "Meningioma", precision: 99.0, recall: 93.0, f1_score: 96.0, support: 306 },
  { class_name: "No Tumor", precision: 96.0, recall: 100.0, f1_score: 98.0, support: 405 },
  { class_name: "Pituitary", precision: 97.0, recall: 100.0, f1_score: 99.0, support: 300 },
];


const trainingHistory = [
  { epoch: 1, loss: 0.4423, accuracy: 83.74, val_loss: null, val_accuracy: null },
  { epoch: 5, loss: 0.0485, accuracy: 98.55, val_loss: null, val_accuracy: null },
  { epoch: 10, loss: 0.0374, accuracy: 98.77, val_loss: null, val_accuracy: null },
  { epoch: 15, loss: 0.0235, accuracy: 99.35, val_loss: null, val_accuracy: null },
];

const confusionMatrixData = [
  // Actual: Glioma
  { predicted: "Glioma", actual: "Glioma", value: 295 },
  { predicted: "Meningioma", actual: "Glioma", value: 3 },
  { predicted: "No Tumor", actual: "Glioma", value: 0 },
  { predicted: "Pituitary", actual: "Glioma", value: 2 },
  // Actual: Meningioma
  { predicted: "Glioma", actual: "Meningioma", value: 1 },
  { predicted: "Meningioma", actual: "Meningioma", value: 284 },
  { predicted: "No Tumor", actual: "Meningioma", value: 15 },
  { predicted: "Pituitary", actual: "Meningioma", value: 6 },
  // Actual: No Tumor
  { predicted: "Glioma", actual: "No Tumor", value: 0 },
  { predicted: "Meningioma", actual: "No Tumor", value: 0 },
  { predicted: "No Tumor", actual: "No Tumor", value: 405 },
  { predicted: "Pituitary", actual: "No Tumor", value: 0 },
  // Actual: Pituitary
  { predicted: "Glioma", actual: "Pituitary", value: 0 },
  { predicted: "Meningioma", actual: "Pituitary", value: 0 },
  { predicted: "No Tumor", actual: "Pituitary", value: 0 },
  { predicted: "Pituitary", actual: "Pituitary", value: 300 },
];

const COLORS = ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981"]

export function PerformanceAnalytics() {
  return (
    <section id="performance" className="py-20 px-6 lg:px-12 bg-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Model Performance Analytics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive analysis of our AI model's performance across different tumor classifications
          </p>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-gradient border-border/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Overall Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{modelMetrics.overall_accuracy}%</div>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingUp className="w-3 h-3" />
              <span>+2.3% from v2</span>
            </div>
          </Card>

          <Card className="card-gradient border-border/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Precision</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{modelMetrics.overall_precision}%</div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendingUp className="w-3 h-3" />
              <span>+3.2% from v2</span>
            </div>
          </Card>

          <Card className="card-gradient border-border/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Recall</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{modelMetrics.overall_recall}%</div>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingUp className="w-3 h-3" />
              <span>+3.1% from v2</span>
            </div>
          </Card>

          <Card className="card-gradient border-border/50 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">F1-Score</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{modelMetrics.overall_f1_score}%</div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendingUp className="w-3 h-3" />
              <span>+3.1% from v2</span>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="class-performance" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="class-performance">Per-Class Performance</TabsTrigger>
            <TabsTrigger value="training-history">Training History</TabsTrigger>
            <TabsTrigger value="confusion-matrix">Confusion Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="class-performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Per-Class Metrics</h3>
                <div className="space-y-6">
                  {classMetrics.map((metric, index) => (
                    <div key={metric.class_name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-sm">
                          {metric.class_name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{metric.support} samples</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Precision</div>
                          <div className="font-medium text-foreground">{metric.precision}%</div>
                          <Progress value={metric.precision} className="h-1 mt-1" />
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Recall</div>
                          <div className="font-medium text-foreground">{metric.recall}%</div>
                          <Progress value={metric.recall} className="h-1 mt-1" />
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">F1-Score</div>
                          <div className="font-medium text-foreground">{metric.f1_score}%</div>
                          <Progress value={metric.f1_score} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Performance Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="class_name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="precision" fill="#6366f1" name="Precision" />
                    <Bar dataKey="recall" fill="#06b6d4" name="Recall" />
                    <Bar dataKey="f1_score" fill="#8b5cf6" name="F1-Score" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
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
                  <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} name="Training Accuracy" />
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
                    <span className="text-xl font-bold text-primary">98.43%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <span className="text-muted-foreground">Standard Deviation</span>
                    <span className="text-lg font-semibold text-foreground">±0.22%</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Individual CV Scores</span>
                    {[98.34, 98.16, 98.69, 98.25, 98.69].map((score, index) => (
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
    </section>
  )
}
