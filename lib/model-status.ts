import { modelClient } from "./model-client"

export interface ModelStatus {
  isAvailable: boolean
  isHealthy: boolean
  responseTime: number | null
  lastChecked: Date
  error: string | null
  mode: "real" | "fallback"
}

export interface ModelHealth {
  status: "healthy" | "unhealthy" | "unknown"
  timestamp: number
  responseTime?: number
}

class ModelStatusManager {
  private status: ModelStatus = {
    isAvailable: false,
    isHealthy: false,
    responseTime: null,
    lastChecked: new Date(),
    error: null,
    mode: "fallback",
  }

  private checkInterval: NodeJS.Timeout | null = null
  private subscribers: Array<(status: ModelStatus) => void> = []

  async checkModelHealth(): Promise<ModelHealth> {
    const startTime = Date.now()

    try {
      const health = await modelClient.checkHealth()
      const responseTime = Date.now() - startTime

      return {
        status: health.status === "healthy" ? "healthy" : "unhealthy",
        timestamp: health.timestamp,
        responseTime,
      }
    } catch (error) {
      return {
        status: "unhealthy",
        timestamp: Date.now(),
        responseTime: Date.now() - startTime,
      }
    }
  }

  async updateStatus(): Promise<ModelStatus> {
    const health = await this.checkModelHealth()

    this.status = {
      isAvailable: health.status === "healthy",
      isHealthy: health.status === "healthy",
      responseTime: health.responseTime || null,
      lastChecked: new Date(),
      error: health.status === "unhealthy" ? "Model service is not responding" : null,
      mode: health.status === "healthy" ? "real" : "fallback",
    }

    // Notify subscribers
    this.subscribers.forEach((callback) => callback(this.status))

    return this.status
  }

  getStatus(): ModelStatus {
    return { ...this.status }
  }

  subscribe(callback: (status: ModelStatus) => void): () => void {
    this.subscribers.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  startPeriodicCheck(intervalMs = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }

    // Initial check
    this.updateStatus()

    // Periodic checks
    this.checkInterval = setInterval(() => {
      this.updateStatus()
    }, intervalMs)
  }

  stopPeriodicCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  async testModelConnection(): Promise<{
    success: boolean
    responseTime: number
    error?: string
  }> {
    const startTime = Date.now()

    try {
      await modelClient.checkHealth()
      return {
        success: true,
        responseTime: Date.now() - startTime,
      }
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Export singleton instance
export const modelStatusManager = new ModelStatusManager()
