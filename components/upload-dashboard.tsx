"use client"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileImage, Brain, Activity, Clock, CheckCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

// Mock prediction data structure from PRD
const mockPredictionResult = {
  predicted_class: "Glioma",
  confidence_score: 87.3,
  class_probabilities: {
    Glioma: 87.3,
    Meningioma: 8.2,
    Pituitary: 3.1,
    "No Tumor": 1.4,
  },
  processing_time_ms: 2340,
  inference_time: 2.34,
}

const classNames = ["Glioma", "Meningioma", "Pituitary", "No Tumor"]

interface UploadState {
  file: File | null
  preview: string | null
  isProcessing: boolean
  progress: number
  result: typeof mockPredictionResult | null
  error: string | null
}

export function UploadDashboard() {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    isProcessing: false,
    progress: 0,
    result: null,
    error: null,
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setUploadState((prev) => ({
        ...prev,
        file,
        preview,
        result: null,
        error: null,
      }))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".dicom"],
    },
    maxFiles: 1,
  })

  const processImage = async () => {
    if (!uploadState.file) return

    setUploadState((prev) => ({ ...prev, isProcessing: true, progress: 0 }))

    // Simulate processing with progress updates
    const progressInterval = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return { ...prev, progress: prev.progress + 10 }
      })
    }, 200)

    // Simulate API call delay
    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        result: mockPredictionResult,
      }))
    }, 2500)
  }

  const resetUpload = () => {
    if (uploadState.preview) {
      URL.revokeObjectURL(uploadState.preview)
    }
    setUploadState({
      file: null,
      preview: null,
      isProcessing: false,
      progress: 0,
      result: null,
      error: null,
    })
  }

  return (
    <section id="dashboard" className="py-20 px-6 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">MRI Classification Dashboard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your MRI scan for real-time brain tumor classification using our advanced AI model
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Interface */}
          <Card className="card-gradient border-border/50 p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload MRI Scan
            </h3>

            {!uploadState.file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">
                  {isDragActive ? "Drop your MRI scan here" : "Drag & drop your MRI scan"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">Supports DICOM, PNG, JPG formats</p>
                <Button variant="outline">Browse Files</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadState.preview! || "/placeholder.svg"}
                    alt="MRI Preview"
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={resetUpload}>
                    Remove
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileImage className="w-4 h-4" />
                  <span>{uploadState.file.name}</span>
                  <span>({(uploadState.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>

                {uploadState.isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Processing...</span>
                      <span className="text-foreground">{uploadState.progress}%</span>
                    </div>
                    <Progress value={uploadState.progress} className="h-2" />
                  </div>
                )}

                <Button onClick={processImage} disabled={uploadState.isProcessing} className="w-full accent-glow">
                  {uploadState.isProcessing ? "Analyzing..." : "Analyze MRI Scan"}
                </Button>
              </div>
            )}
          </Card>

          {/* Results Display */}
          <Card className="card-gradient border-border/50 p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              Classification Results
            </h3>

            {!uploadState.result ? (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload an MRI scan to see classification results</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Primary Classification */}
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm text-primary font-medium">Primary Classification</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{uploadState.result.predicted_class}</div>
                  <div className="text-lg text-primary font-semibold">
                    {uploadState.result.confidence_score}% Confidence
                  </div>
                </div>

                {/* Confidence Breakdown */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Probability Distribution</h4>
                  <div className="space-y-3">
                    {Object.entries(uploadState.result.class_probabilities).map(([className, probability]) => (
                      <div key={className} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={className === uploadState.result!.predicted_class ? "default" : "secondary"}
                            className="min-w-[80px] justify-center"
                          >
                            {className}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${probability}%` }}
                            />
                          </div>
                          <span className="text-sm text-foreground font-medium min-w-[40px] text-right">
                            {probability}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <div>
                      <div className="text-xs text-muted-foreground">Processing Time</div>
                      <div className="text-sm font-medium text-foreground">{uploadState.result.inference_time}s</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Model Status</div>
                      <div className="text-sm font-medium text-foreground">Active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
