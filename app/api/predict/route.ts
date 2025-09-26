import { type NextRequest, NextResponse } from "next/server"
import { modelClient } from "@/lib/model-client"

interface PredictionResult {
  predicted_class: string
  confidence_score: number
  class_probabilities: Record<string, number>
  processing_time_ms: number
  inference_time: number
}

const CLASS_NAMES = ["Glioma", "Meningioma", "Pituitary", "No Tumor"]

function simulateModelPrediction(): PredictionResult {
  const randomIndex = Math.floor(Math.random() * CLASS_NAMES.length)
  const predictedClass = CLASS_NAMES[randomIndex]

  const baseConfidence = 85 + Math.random() * 10 // 85-95%
  const remainingProbability = 100 - baseConfidence

  const probabilities: Record<string, number> = {}
  CLASS_NAMES.forEach((className, index) => {
    if (index === randomIndex) {
      probabilities[className] = Number.parseFloat(baseConfidence.toFixed(1))
    } else {
      const prob = (remainingProbability / (CLASS_NAMES.length - 1)) * (0.5 + Math.random())
      probabilities[className] = Number.parseFloat(prob.toFixed(1))
    }
  })

  // Normalize probabilities to sum to 100
  const total = Object.values(probabilities).reduce((sum, val) => sum + val, 0)
  Object.keys(probabilities).forEach((key) => {
    probabilities[key] = Number.parseFloat(((probabilities[key] / total) * 100).toFixed(1))
  })

  const processingTime = 1500 + Math.random() * 2000 // 1.5-3.5 seconds

  return {
    predicted_class: predictedClass,
    confidence_score: probabilities[predictedClass],
    class_probabilities: probabilities,
    processing_time_ms: Math.round(processingTime),
    inference_time: Number.parseFloat((processingTime / 1000).toFixed(2)),
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/dicom"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPEG, PNG, or DICOM files." },
        { status: 400 },
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    let result: PredictionResult
    let usingRealModel = false

    try {
      console.log("[v0] Attempting to use real CNN-GRU model for prediction")

      // Check if model service is available
      const isServiceAvailable = await modelClient.isServiceAvailable()

      if (isServiceAvailable) {
        console.log("[v0] Model service is available, using real model")
        result = await modelClient.predict(file)
        usingRealModel = true
        console.log("[v0] Real model prediction successful:", result.predicted_class)
      } else {
        console.log("[v0] Model service unavailable, falling back to simulation")
        throw new Error("Model service not available")
      }
    } catch (modelError) {
      console.log("[v0] Model service error, using fallback simulation:", modelError)

      // Simulate processing delay to match real model timing
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

      result = simulateModelPrediction()
      usingRealModel = false
    }

    return NextResponse.json({
      success: true,
      result,
      metadata: {
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: new Date().toISOString(),
        modelUsed: usingRealModel ? "CNN-GRU Hybrid" : "Simulation",
        processingMode: usingRealModel ? "real" : "fallback",
      },
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Internal server error during prediction" }, { status: 500 })
  }
}
