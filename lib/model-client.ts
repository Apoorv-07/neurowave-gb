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

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TimeoutError"
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ServerError"
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NetworkError"
  }
}

class ModelClient {
  private baseUrl: string
  private timeout: number

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-render-backend.onrender.com",
    timeout = 30000,
  ) {
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
          "Content-Type": imageFile.type,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status >= 500) {
          throw new ServerError(
            errorData.error || "An unexpected error occurred on the backend. The team has been notified.",
          )
        } else if (response.status === 422) {
          throw new ValidationError(errorData.error || "The uploaded file format is not supported or corrupted.")
        } else {
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }
      }

      const data = await response.json()

      if (!data.success) {
        throw new ValidationError(data.error || "Prediction failed")
      }

      return data.result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("The model took too long to respond. Please try again.")
        }
        if (error instanceof TimeoutError || error instanceof ServerError || error instanceof ValidationError) {
          throw error
        }
        if (
          error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("Failed to fetch")
        ) {
          throw new NetworkError("Please check your internet connection.")
        }
        throw error
      }
      throw new NetworkError("An unknown network error occurred")
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
