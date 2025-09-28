interface PredictionResult {
  predicted_class: string;
  confidence_score: number;
  class_probabilities: Record<string, number>;
  processing_time_ms: number;
  inference_time: number;
}

interface ModelInfo {
  model_type: string;
  backbone: string;
  sequence_model: string;
  num_classes: number;
  class_names: string[];
  total_parameters: number;
  trainable_parameters: number;
  device: string;
  input_size: string;
  status: string;
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

class ModelClient {
  private baseUrl: string;
  private timeout: number;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL || "",
    timeout = 30000,
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async predict(imageFile: File): Promise<PredictionResult> {
    try {
      // Create a FormData object to properly package the file.
      const formData = new FormData();
      // The key "file" here must match the variable name in your FastAPI endpoint.
      formData.append("file", imageFile);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: "POST",
        body: formData,
        // NOTE: Do NOT set the Content-Type header manually when using FormData.
        // The browser will automatically set it correctly.
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status >= 500) throw new ServerError(errorMessage);
        if (response.status === 422) throw new ValidationError(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Prediction failed");
      }

      return data.result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("Request timeout: The model took too long to respond.");
        }
        // Re-throw custom errors
        if (error instanceof ServerError || error instanceof ValidationError || error instanceof TimeoutError) {
          throw error;
        }
      }
      // Treat all other errors as potential network issues
      throw new NetworkError("Prediction failed. Please check your network connection.");
    }
  }

  async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/model-info`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new NetworkError("Failed to get model information. Please check your connection.");
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error("Model service is not available");
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const modelClient = new ModelClient();
export type { PredictionResult, ModelInfo };
