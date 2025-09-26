"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Cpu, Database, Settings, Layers, Code, Server, HardDrive, Zap } from "lucide-react"

// Mock technical data from PRD structure
const datasetInfo = {
  total_dataset_size: 15420,
  training_set_size: 10794,
  validation_set_size: 2313,
  test_set_size: 2313,
  class_distribution: {
    Glioma: 3264,
    Meningioma: 4621,
    Pituitary: 3762,
    "No Tumor": 3773,
  },
}

const modelInfo = {
  model_type: "Convolutional Neural Network",
  architecture: "Custom ResNet-50 with Attention Mechanism",
  total_parameters: 25847296,
  trainable_parameters: 25794048,
  model_size_mb: 98.7,
  input_image_size: "224x224x3",
  output_classes: 4,
}

const trainingConfig = {
  optimizer_type: "AdamW",
  learning_rate: 0.0001,
  batch_size: 32,
  epochs_trained: 150,
  early_stopping_patience: 15,
  weight_decay: 0.01,
  dropout_rate: 0.3,
}

const preprocessingSteps = [
  "DICOM to PNG conversion",
  "Skull stripping and brain extraction",
  "Intensity normalization (0-1 range)",
  "Resize to 224x224 pixels",
  "Data augmentation (rotation, flip, zoom)",
  "Gaussian noise addition (training only)",
]

const dataAugmentation = [
  "Random rotation (±15 degrees)",
  "Horizontal flip (50% probability)",
  "Random zoom (0.9-1.1 scale)",
  "Brightness adjustment (±10%)",
  "Contrast enhancement (±15%)",
  "Gaussian blur (σ=0.5-1.5)",
]

const architectureLayers = [
  { name: "Input Layer", type: "Input", shape: "224x224x3", parameters: 0 },
  { name: "Conv Block 1", type: "Convolution", shape: "112x112x64", parameters: 9408 },
  { name: "MaxPool 1", type: "Pooling", shape: "56x56x64", parameters: 0 },
  { name: "ResNet Block 1", type: "Residual", shape: "56x56x256", parameters: 215808 },
  { name: "ResNet Block 2", type: "Residual", shape: "28x28x512", parameters: 1180672 },
  { name: "ResNet Block 3", type: "Residual", shape: "14x14x1024", parameters: 7098368 },
  { name: "ResNet Block 4", type: "Residual", shape: "7x7x2048", parameters: 14964736 },
  { name: "Attention Layer", type: "Attention", shape: "7x7x2048", parameters: 2097152 },
  { name: "Global Avg Pool", type: "Pooling", shape: "1x1x2048", parameters: 0 },
  { name: "Dropout", type: "Regularization", shape: "2048", parameters: 0 },
  { name: "Dense Layer", type: "Dense", shape: "512", parameters: 1049088 },
  { name: "Output Layer", type: "Dense", shape: "4", parameters: 2052 },
]

export function TechnicalDetails() {
  const totalDatasetSize = Object.values(datasetInfo.class_distribution).reduce((a, b) => a + b, 0)

  return (
    <section id="technical" className="py-20 px-6 lg:px-12 bg-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Technical Implementation</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dive into the technical architecture, dataset composition, and training methodology
          </p>
        </div>

        <Tabs defaultValue="dataset" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="dataset">Dataset Info</TabsTrigger>
            <TabsTrigger value="architecture">Model Architecture</TabsTrigger>
            <TabsTrigger value="training">Training Config</TabsTrigger>
            <TabsTrigger value="preprocessing">Data Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="dataset" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Dataset Overview
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-2xl font-bold text-primary">
                        {datasetInfo.total_dataset_size.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Samples</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="text-2xl font-bold text-accent">4</div>
                      <div className="text-sm text-muted-foreground">Classes</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Training Set</span>
                      <span className="font-medium text-foreground">
                        {datasetInfo.training_set_size.toLocaleString()} (70%)
                      </span>
                    </div>
                    <Progress value={70} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Validation Set</span>
                      <span className="font-medium text-foreground">
                        {datasetInfo.validation_set_size.toLocaleString()} (15%)
                      </span>
                    </div>
                    <Progress value={15} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Test Set</span>
                      <span className="font-medium text-foreground">
                        {datasetInfo.test_set_size.toLocaleString()} (15%)
                      </span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" />
                  Class Distribution
                </h3>
                <div className="space-y-4">
                  {Object.entries(datasetInfo.class_distribution).map(([className, count]) => {
                    const percentage = ((count / totalDatasetSize) * 100).toFixed(1)
                    return (
                      <div key={className} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="min-w-[100px] justify-center">
                            {className}
                          </Badge>
                          <div className="text-sm">
                            <span className="font-medium text-foreground">{count.toLocaleString()}</span>
                            <span className="text-muted-foreground ml-2">({percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={Number.parseFloat(percentage)} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Model Specifications
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Architecture</div>
                    <div className="font-medium text-foreground text-sm">{modelInfo.architecture}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Model Type</div>
                    <div className="font-medium text-foreground text-sm">{modelInfo.model_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Input Size</div>
                    <div className="font-medium text-foreground text-sm">{modelInfo.input_image_size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Output Classes</div>
                    <div className="font-medium text-foreground text-sm">{modelInfo.output_classes}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Model Size</div>
                    <div className="font-medium text-foreground text-sm">{modelInfo.model_size_mb} MB</div>
                  </div>
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-accent" />
                  Parameters
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold text-primary">{modelInfo.total_parameters.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Parameters</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="text-2xl font-bold text-accent">
                      {modelInfo.trainable_parameters.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Trainable Parameters</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {(modelInfo.total_parameters - modelInfo.trainable_parameters).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Frozen Parameters</div>
                  </div>
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Layer Architecture
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {architectureLayers.map((layer, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary/50 text-xs">
                      <div>
                        <div className="font-medium text-foreground">{layer.name}</div>
                        <div className="text-muted-foreground">{layer.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-foreground">{layer.shape}</div>
                        <div className="text-muted-foreground">{layer.parameters.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Training Configuration
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Optimizer</div>
                    <div className="font-medium text-foreground">{trainingConfig.optimizer_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Learning Rate</div>
                    <div className="font-medium text-foreground">{trainingConfig.learning_rate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Batch Size</div>
                    <div className="font-medium text-foreground">{trainingConfig.batch_size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Epochs</div>
                    <div className="font-medium text-foreground">{trainingConfig.epochs_trained}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Weight Decay</div>
                    <div className="font-medium text-foreground">{trainingConfig.weight_decay}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Dropout Rate</div>
                    <div className="font-medium text-foreground">{trainingConfig.dropout_rate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Early Stopping</div>
                    <div className="font-medium text-foreground">{trainingConfig.early_stopping_patience} epochs</div>
                  </div>
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Server className="w-5 h-5 text-accent" />
                  Infrastructure
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div>
                      <div className="font-medium text-foreground">GPU</div>
                      <div className="text-sm text-muted-foreground">NVIDIA A100 80GB</div>
                    </div>
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div>
                      <div className="font-medium text-foreground">Framework</div>
                      <div className="text-sm text-muted-foreground">PyTorch 2.0.1</div>
                    </div>
                    <Code className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                    <div>
                      <div className="font-medium text-foreground">Training Time</div>
                      <div className="text-sm text-muted-foreground">~18 hours</div>
                    </div>
                    <Server className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preprocessing" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Preprocessing Pipeline
                </h3>
                <div className="space-y-3">
                  {preprocessingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="text-sm text-foreground">{step}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="card-gradient border-border/50 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" />
                  Data Augmentation
                </h3>
                <div className="space-y-3">
                  {dataAugmentation.map((augmentation, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="text-sm text-foreground">{augmentation}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
