// API client for NeuroWave platform
export interface PredictionResult {
  predicted_class: string
  confidence_score: number
  class_probabilities: Record<string, number>
  processing_time_ms: number
  inference_time: number
}

export interface ModelMetrics {
  overall_accuracy: number
  overall_precision: number
  overall_recall: number
  overall_f1_score: number
  processing_time: number
  inference_time: number
  model_accuracy: number
  num_classes: number
  total_samples: number
  class_names: string[]
  class_metrics: Array<{
    class_name: string
    precision: number
    recall: number
    f1_score: number
    support: number
  }>
  confusion_matrix_data: number[][]
  training_history: {
    loss: number[]
    accuracy: number[]
    val_loss: number[]
    val_accuracy: number[]
    epochs_trained: number
  }
  cv_scores: number[]
  mean_cv_score: number
  cv_std_deviation: number
  timestamp?: string
  status?: string
}

export interface ModelInfo {
  model_type: string
  model_architecture: string
  total_parameters: number
  trainable_parameters: number
  model_size_mb: number
  input_image_size: string
  output_classes: number
  framework: string
  version: string
  dataset_info: {
    total_dataset_size: number
    training_set_size: number
    validation_set_size: number
    test_set_size: number
    class_distribution: Record<string, number>
  }
  training_config: {
    optimizer_type: string
    learning_rate: number
    batch_size: number
    epochs_trained: number
    early_stopping_patience: number
    weight_decay: number
    dropout_rate: number
  }
  preprocessing_steps: string[]
  data_augmentation_techniques: string[]
  performance_requirements: {
    min_required_accuracy: number
    max_processing_time: number
    confidence_threshold: number
    target_accuracy: number
  }
  last_updated?: string
  status?: string
  health_check?: string
}

class NeuroWaveAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  async predictImage(file: File): Promise<{ success: boolean; result?: PredictionResult; error?: string }> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed")
      }

      return data
    } catch (error) {
      console.error("Prediction API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getModelMetrics(): Promise<{ success: boolean; metrics?: ModelMetrics; error?: string }> {
    try {
      const response = await fetch("/api/metrics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch metrics")
      }

      return data
    } catch (error) {
      console.error("Metrics API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getModelInfo(): Promise<{ success: boolean; model_info?: ModelInfo; error?: string }> {
    try {
      const response = await fetch("/api/model-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch model info")
      }

      return data
    } catch (error) {
      console.error("Model info API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }
}

export const neuroWaveAPI = new NeuroWaveAPI()
