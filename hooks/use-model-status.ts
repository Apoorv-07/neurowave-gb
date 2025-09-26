"use client"

import { useState, useEffect } from "react"
import { modelStatusManager, type ModelStatus } from "@/lib/model-status"

export function useModelStatus() {
  const [status, setStatus] = useState<ModelStatus>(modelStatusManager.getStatus())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Subscribe to status updates
    const unsubscribe = modelStatusManager.subscribe(setStatus)

    // Start periodic health checks
    modelStatusManager.startPeriodicCheck(30000) // Check every 30 seconds

    return () => {
      unsubscribe()
      modelStatusManager.stopPeriodicCheck()
    }
  }, [])

  const refreshStatus = async () => {
    setIsLoading(true)
    try {
      await modelStatusManager.updateStatus()
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      return await modelStatusManager.testModelConnection()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    status,
    isLoading,
    refreshStatus,
    testConnection,
    isModelAvailable: status.isAvailable,
    isModelHealthy: status.isHealthy,
    modelMode: status.mode,
    lastChecked: status.lastChecked,
    responseTime: status.responseTime,
    error: status.error,
  }
}
