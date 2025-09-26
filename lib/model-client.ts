interface PredictionResult {
  predicted_class: string
  confidence_score: number
  class_probabilities: Record<string, number>
  processing_time_ms: number
  inference_time: number
}

interface ModelInfo {
  model_type: string
  backbone: string
  sequence_model: string
  num_classes: number
  class_names: string[]
  total_parameters: number
  trainable_parameters: number
  device: string
  input_size: string
  status: string
}

class ModelClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001", timeout = 30000) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  async predict(imageFile: File): Promise<PredictionResult> {
    try {
      const formData = new FormData()
      formData.append("file", imageFile)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: "POST",
        body: await imageFile.arrayBuffer(),
        headers: {
          "Content-Type": "application/octet-stream",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Prediction failed")
      }

      return data.result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout - model inference took too long")
        }
        throw error
      }
      throw new Error("Unknown error occurred during prediction")
    }
  }

  async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/model-info`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to get model information")
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      throw new Error("Model service is not available")
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      await this.checkHealth()
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const modelClient = new ModelClient()
export type { PredictionResult, ModelInfo }
