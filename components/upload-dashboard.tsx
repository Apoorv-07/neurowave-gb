"use client"

import { useState, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileImage, Brain, Activity, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { modelClient } from "@/lib/model-client"

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

    setUploadState((prev) => ({ ...prev, isProcessing: true, progress: 0, error: null }))

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return { ...prev, progress: prev.progress + 10 }
      })
    }, 200)

    try {
      // Use real API call
      const result = await modelClient.predict(uploadState.file)

      clearInterval(progressInterval)
      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        result,
        error: null,
      }))
    } catch (error) {
      clearInterval(progressInterval)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        progress: 0,
        error: errorMessage,
      }))
    }
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
    <section id="dashboard" className="py-24 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="fade-in-up text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">MRI Classification Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload your MRI scan for real-time brain tumor classification using our advanced AI model with
            state-of-the-art accuracy and lightning-fast processing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <Card className="fade-in-left card-glassmorphism border-primary/20 p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Upload className="w-6 h-6 text-primary" />
              Upload MRI Scan
            </h3>

            {!uploadState.file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-primary bg-primary/10 glow-primary"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <input {...getInputProps()} />
                <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <p className="text-foreground font-semibold text-lg mb-3">
                  {isDragActive ? "Drop your MRI scan here" : "Drag & drop your MRI scan"}
                </p>
                <p className="text-muted-foreground mb-6">Supports DICOM, PNG, JPG formats up to 10MB</p>
                <Button variant="outline" className="btn-glow bg-transparent">
                  Browse Files
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={uploadState.preview! || "/placeholder.svg"}
                    alt="MRI Preview"
                    className="w-full h-80 object-cover rounded-xl border border-border"
                  />
                  <Button variant="destructive" size="sm" className="absolute top-4 right-4" onClick={resetUpload}>
                    Remove
                  </Button>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <FileImage className="w-5 h-5" />
                  <span className="font-medium">{uploadState.file.name}</span>
                  <span>({(uploadState.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>

                {uploadState.isProcessing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Processing...</span>
                      <span className="text-foreground font-bold">{uploadState.progress}%</span>
                    </div>
                    <Progress value={uploadState.progress} className="h-3" />
                  </div>
                )}

                {uploadState.error && (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="font-medium">{uploadState.error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={processImage}
                  disabled={uploadState.isProcessing}
                  className="w-full btn-glow py-4 text-lg font-semibold"
                >
                  {uploadState.isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Analyzing MRI Scan...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-3" />
                      Analyze MRI Scan
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          <Card className="fade-in-right card-glassmorphism border-accent/20 p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Brain className="w-6 h-6 text-accent" />
              Classification Results
            </h3>

            {uploadState.isProcessing ? (
              <div className="flex items-center justify-center h-80 text-center">
                <div className="space-y-6">
                  <Brain className="w-20 h-20 text-primary mx-auto animate-pulse glow-primary" />
                  <div>
                    <p className="text-foreground font-semibold text-lg mb-3">Analyzing MRI Scan...</p>
                    <p className="text-muted-foreground">
                      Our AI model is processing your image with advanced neural networks
                    </p>
                  </div>
                </div>
              </div>
            ) : !uploadState.result ? (
              <div className="flex items-center justify-center h-80 text-center">
                <div>
                  <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                  <p className="text-muted-foreground text-lg">Upload an MRI scan to see classification results</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/30 glow-primary">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-primary font-semibold">Primary Classification</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{uploadState.result.predicted_class}</div>
                  <div className="text-xl text-primary font-bold">
                    {uploadState.result.confidence_score}% Confidence
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Probability Distribution</h4>
                  <div className="space-y-4">
                    {Object.entries(uploadState.result.class_probabilities).map(([className, probability]) => (
                      <div key={className} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={className === uploadState.result!.predicted_class ? "default" : "secondary"}
                            className="min-w-[100px] justify-center py-2"
                          >
                            {className}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 flex-1 ml-6">
                          <div className="flex-1 bg-secondary rounded-full h-3">
                            <div
                              className="bg-primary h-3 rounded-full transition-all duration-1000 glow-primary"
                              style={{ width: `${probability}%` }}
                            />
                          </div>
                          <span className="text-foreground font-bold min-w-[50px] text-right">{probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/30">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <div className="text-sm text-muted-foreground">Processing Time</div>
                      <div className="text-lg font-bold text-foreground">{uploadState.result.inference_time}s</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Model Status</div>
                      <div className="text-lg font-bold text-primary">Active</div>
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
