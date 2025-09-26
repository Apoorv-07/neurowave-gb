"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useModelStatus } from "@/hooks/use-model-status"
import { RefreshCw, Zap, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ModelStatusIndicatorProps {
  variant?: "compact" | "detailed"
  showRefresh?: boolean
}

export function ModelStatusIndicator({ variant = "compact", showRefresh = false }: ModelStatusIndicatorProps) {
  const {
    status,
    isLoading,
    refreshStatus,
    testConnection,
    isModelAvailable,
    isModelHealthy,
    modelMode,
    lastChecked,
    responseTime,
    error,
  } = useModelStatus()

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (isModelHealthy) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (isModelAvailable) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusText = () => {
    if (isLoading) return "Checking..."
    if (isModelHealthy) return "Model Active"
    if (isModelAvailable) return "Model Warning"
    return "Model Offline"
  }

  const getStatusColor = () => {
    if (isModelHealthy) return "bg-green-500"
    if (isModelAvailable) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getModeText = () => {
    return modelMode === "real" ? "CNN-GRU Model" : "Simulation Mode"
  }

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge variant={isModelHealthy ? "default" : "secondary"}>{getModeText()}</Badge>
              {showRefresh && (
                <Button variant="ghost" size="sm" onClick={refreshStatus} disabled={isLoading}>
                  <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{getStatusText()}</div>
              <div className="text-muted-foreground">
                Last checked: {formatDistanceToNow(lastChecked, { addSuffix: true })}
              </div>
              {responseTime && <div className="text-muted-foreground">Response time: {responseTime}ms</div>}
              {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <CardTitle className="text-sm font-medium">{getStatusText()}</CardTitle>
          </div>
          {showRefresh && (
            <Button variant="ghost" size="sm" onClick={refreshStatus} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>
        <CardDescription>
          {getModeText()} • Last checked {formatDistanceToNow(lastChecked, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="font-medium flex items-center gap-1">
              {getStatusIcon()}
              {isModelHealthy ? "Healthy" : "Unavailable"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Response Time</div>
            <div className="font-medium">{responseTime ? `${responseTime}ms` : "N/A"}</div>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-md">
            <div className="text-red-600 dark:text-red-400 text-xs">{error}</div>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" onClick={testConnection} disabled={isLoading}>
            <Zap className="h-3 w-3 mr-1" />
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
