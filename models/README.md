# NeuroWave Model Directory

This directory contains the trained CNN-GRU brain tumor classification model and related files.

## Model File Placement

**IMPORTANT**: Place your trained model file here:

\`\`\`
models/
├── brain_tumor_classifier.pth  ← Place your 150MB trained model here
├── cnn_gru_classifier.py       ← Model architecture and predictor class
└── README.md                   ← This file
\`\`\`

## Model File Requirements

- **File name**: `brain_tumor_classifier.pth`
- **Size**: ~150MB (your trained model)
- **Format**: PyTorch state dictionary (.pth file)
- **Classes**: ["Glioma", "Meningioma", "Pituitary", "No Tumor"]

## Model Architecture

The model uses a hybrid CNN-GRU architecture:

- **Backbone**: ResNet50 (pre-trained on ImageNet)
- **Sequence Model**: Bidirectional GRU (512 hidden units, 2 layers)
- **Input Size**: 224x224 RGB images
- **Output**: 4 classes with confidence scores

## Usage

1. **Place your model**: Copy `brain_tumor_classifier.pth` to this directory
2. **Start inference service**: Run the Python inference service
3. **API Integration**: The Next.js API will communicate with the Python service

## Dependencies

The model requires the following Python packages:
- torch
- torchvision
- numpy
- Pillow
- scikit-learn (for metrics)

## Performance

- **Processing Time**: ~1.5-3.5 seconds per image
- **Accuracy**: Based on your training results
- **Device**: Supports both CPU and GPU inference
