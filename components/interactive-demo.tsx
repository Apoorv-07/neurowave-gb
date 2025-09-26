"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Brain, Activity, Clock, CheckCircle, ArrowRight } from "lucide-react"

// Mock sample data from PRD
const demoSamples = [
  {
    id: 1,
    name: "Glioma Sample 1",
    image: "/brain-mri-scan-glioma-tumor.jpg",
    actualClass: "Glioma",
    confidence: 94.2,
    probabilities: { Glioma: 94.2, Meningioma: 3.1, Pituitary: 1.8, "No Tumor": 0.9 },
    processingTime: 2.1,
    description: "High-grade glioma with characteristic irregular borders and heterogeneous enhancement",
  },
  {
    id: 2,
    name: "Meningioma Sample 1",
    image: "/brain-mri-scan-meningioma-tumor.jpg",
    actualClass: "Meningioma",
    confidence: 91.7,
    probabilities: { Meningioma: 91.7, Glioma: 4.2, Pituitary: 2.8, "No Tumor": 1.3 },
    processingTime: 1.9,
    description: "Well-circumscribed meningioma with homogeneous enhancement and dural tail",
  },
  {
    id: 3,
    name: "Pituitary Sample 1",
    image: "/brain-mri-scan-pituitary-tumor.jpg",
    actualClass: "Pituitary",
    confidence: 89.3,
    probabilities: { Pituitary: 89.3, Meningioma: 6.1, Glioma: 3.2, "No Tumor": 1.4 },
    processingTime: 2.3,
    description: "Pituitary adenoma with suprasellar extension and optic chiasm compression",
  },
  {
    id: 4,
    name: "No Tumor Sample 1",
    image: "/normal-brain-mri-scan-no-tumor.jpg",
    actualClass: "No Tumor",
    confidence: 96.8,
    probabilities: { "No Tumor": 96.8, Glioma: 1.2, Meningioma: 1.1, Pituitary: 0.9 },
    processingTime: 1.7,
    description: "Normal brain anatomy with no evidence of pathological enhancement",
  },
]

const analysisSteps = [
  { step: 1, title: "Image Preprocessing", description: "Normalize and resize MRI scan", duration: 0.3 },
  { step: 2, title: "Feature Extraction", description: "Extract relevant anatomical features", duration: 0.8 },
  { step: 3, title: "Neural Network Inference", description: "Process through trained CNN model", duration: 1.1 },
  { step: 4, title: "Classification", description: "Generate probability distribution", duration: 0.2 },
]

export function InteractiveDemo() {
  const [selectedSample, setSelectedSample] = useState<(typeof demoSamples)[0] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const runAnalysis = async (sample: (typeof demoSamples)[0]) => {
    setSelectedSample(sample)
    setIsAnalyzing(true)
    setCurrentStep(0)
    setShowResult(false)

    // Simulate step-by-step analysis
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, analysisSteps[i].duration * 1000))
    }

    setIsAnalyzing(false)
    setShowResult(true)
  }

  const resetDemo = () => {
    setSelectedSample(null)
    setIsAnalyzing(false)
    setCurrentStep(0)
    setShowResult(false)
  }

  return (
    <section id="demo" className="py-20 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Interactive Demo</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our AI model in action with pre-loaded sample MRI scans from each tumor classification
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sample Gallery */}
          <div className="lg:col-span-1">
            <Card className="card-gradient border-border/50 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Sample MRI Gallery
              </h3>
              <div className="space-y-4">
                {demoSamples.map((sample) => (
                  <div
                    key={sample.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedSample?.id === sample.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                    onClick={() => !isAnalyzing && runAnalysis(sample)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sample.image || "/placeholder.svg"}
                        alt={sample.name}
                        className="w-12 h-12 rounded object-cover border border-border"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">{sample.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {sample.actualClass}
                        </Badge>
                      </div>
                      <Play className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>

              {selectedSample && (
                <Button variant="outline" onClick={resetDemo} className="w-full mt-4 bg-transparent">
                  Reset Demo
                </Button>
              )}
            </Card>
          </div>

          {/* Analysis Process */}
          <div className="lg:col-span-2">
            {!selectedSample ? (
              <Card className="card-gradient border-border/50 p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Select a Sample to Begin</h3>
                  <p className="text-muted-foreground">
                    Choose an MRI sample from the gallery to see our AI model analyze it step-by-step
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Selected Sample Display */}
                <Card className="card-gradient border-border/50 p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={selectedSample.image || "/placeholder.svg"}
                      alt={selectedSample.name}
                      className="w-32 h-32 rounded-lg object-cover border border-border"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{selectedSample.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{selectedSample.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{selectedSample.actualClass}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{selectedSample.processingTime}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Step-by-Step Analysis */}
                <Card className="card-gradient border-border/50 p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Analysis Process
                  </h3>
                  <div className="space-y-4">
                    {analysisSteps.map((step, index) => (
                      <div
                        key={step.step}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                          isAnalyzing && currentStep === index
                            ? "bg-primary/10 border border-primary/20"
                            : isAnalyzing && currentStep > index
                              ? "bg-accent/10 border border-accent/20"
                              : "bg-secondary border border-border"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isAnalyzing && currentStep >= index
                              ? currentStep === index
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isAnalyzing && currentStep > index ? <CheckCircle className="w-4 h-4" /> : step.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{step.title}</div>
                          <div className="text-sm text-muted-foreground">{step.description}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{step.duration}s</div>
                        {isAnalyzing && currentStep === index && (
                          <div className="w-6 h-6">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Results */}
                {showResult && (
                  <Card className="card-gradient border-border/50 p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      Classification Results
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-center p-6 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="text-sm text-primary font-medium mb-2">Predicted Classification</div>
                        <div className="text-2xl font-bold text-foreground mb-1">{selectedSample.actualClass}</div>
                        <div className="text-lg text-primary font-semibold">
                          {selectedSample.confidence}% Confidence
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-foreground mb-3">Probability Distribution</div>
                        <div className="space-y-2">
                          {Object.entries(selectedSample.probabilities).map(([className, probability]) => (
                            <div key={className} className="flex items-center justify-between">
                              <Badge
                                variant={className === selectedSample.actualClass ? "default" : "secondary"}
                                className="min-w-[80px] justify-center text-xs"
                              >
                                {className}
                              </Badge>
                              <div className="flex items-center gap-2 flex-1 ml-3">
                                <Progress value={probability} className="h-2" />
                                <span className="text-sm font-medium text-foreground min-w-[40px] text-right">
                                  {probability}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Total Processing Time: {selectedSample.processingTime}s</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => runAnalysis(selectedSample)}>
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Run Again
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
