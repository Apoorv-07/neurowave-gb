"use client"

import { useState, useEffect } from "react"
import { neuroWaveAPI, type ModelMetrics, type ModelInfo } from "@/lib/api-client"

export function useModelMetrics() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await neuroWaveAPI.getModelMetrics()

      if (response.success && response.metrics) {
        setMetrics(response.metrics)
      } else {
        setError(response.error || "Failed to fetch metrics")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return { metrics, loading, error, refetch: fetchMetrics }
}

export function useModelInfo() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModelInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await neuroWaveAPI.getModelInfo()

      if (response.success && response.model_info) {
        setModelInfo(response.model_info)
      } else {
        setError(response.error || "Failed to fetch model info")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModelInfo()
  }, [])

  return { modelInfo, loading, error, refetch: fetchModelInfo }
}
