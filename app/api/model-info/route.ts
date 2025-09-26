import { NextResponse } from "next/server"
import { modelClient } from "@/lib/model-client"

const fallbackModelInfo = {
  model_type: "CNN-GRU Hybrid",
  model_architecture: "ResNet-50 + Bidirectional GRU",
  backbone: "ResNet50",
  sequence_model: "Bidirectional GRU",
  total_parameters: 25847296,
  trainable_parameters: 25794048,
  model_size_mb: 150.0,
  input_image_size: "224x224x3",
  output_classes: 4,
  class_names: ["Glioma", "Meningioma", "Pituitary", "No Tumor"],
  framework: "PyTorch 2.0+",
  version: "1.0.0",
  device: "CPU/CUDA",

  dataset_info: {
    total_dataset_size: 15420,
    training_set_size: 10794,
    validation_set_size: 2313,
    test_set_size: 2313,
    class_distribution: {
      Glioma: 3264,
      Meningioma: 4621,
      Pituitary: 3762,
      "No Tumor": 3773,
    },
  },

  training_config: {
    optimizer_type: "Adam",
    learning_rate: 0.0001,
    batch_size: 32,
    epochs_trained: 15,
    cv_folds: 5,
    gru_hidden_size: 512,
    gru_num_layers: 2,
    dropout_rate: 0.5,
  },

  preprocessing_steps: [
    "Resize to 224x224 pixels",
    "Convert to RGB format",
    "Normalize with ImageNet statistics",
    "Random horizontal flip (training)",
    "Random rotation ±10° (training)",
    "Tensor conversion",
  ],

  data_augmentation_techniques: [
    "Random horizontal flip",
    "Random rotation (±10 degrees)",
    "ImageNet normalization",
    "Resize and center crop",
  ],

  performance_requirements: {
    min_required_accuracy: 90.0,
    max_processing_time: 5.0,
    confidence_threshold: 85.0,
    target_accuracy: 95.0,
  },
}

export async function GET() {
  try {
    let modelInfo = fallbackModelInfo
    let usingRealModel = false

    try {
      console.log("[v0] Attempting to fetch real model info")

      const isServiceAvailable = await modelClient.isServiceAvailable()

      if (isServiceAvailable) {
        const realModelInfo = await modelClient.getModelInfo()
        console.log("[v0] Real model info retrieved successfully")

        modelInfo = {
          ...fallbackModelInfo,
          model_type: realModelInfo.model_type,
          backbone: realModelInfo.backbone,
          sequence_model: realModelInfo.sequence_model,
          total_parameters: realModelInfo.total_parameters,
          trainable_parameters: realModelInfo.trainable_parameters,
          class_names: realModelInfo.class_names,
          device: realModelInfo.device,
          input_image_size: realModelInfo.input_size,
          status: realModelInfo.status,
        }
        usingRealModel = true
      } else {
        console.log("[v0] Model service unavailable, using fallback info")
      }
    } catch (modelError) {
      console.log("[v0] Error fetching real model info:", modelError)
    }

    return NextResponse.json({
      success: true,
      model_info: {
        ...modelInfo,
        last_updated: new Date().toISOString(),
        status: usingRealModel ? "deployed" : "fallback",
        health_check: usingRealModel ? "passing" : "simulated",
        data_source: usingRealModel ? "real_model" : "fallback",
      },
    })
  } catch (error) {
    console.error("Model info error:", error)
    return NextResponse.json({ error: "Failed to fetch model information" }, { status: 500 })
  }
}
