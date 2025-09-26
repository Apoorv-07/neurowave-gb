# NeuroWave Model Integration Guide

This guide explains how to integrate your trained CNN-GRU brain tumor classification model with the NeuroWave platform.

## Quick Start

### 1. Place Your Model File

Copy your trained model to the correct location:

\`\`\`bash
# Place your 150MB trained model here:
models/brain_tumor_classifier.pth
\`\`\`

### 2. Install Python Dependencies

\`\`\`bash
cd scripts
pip install -r requirements.txt
\`\`\`

### 3. Start the Model Service

\`\`\`bash
# Option 1: Using the startup script (recommended)
python scripts/start_model_service.py

# Option 2: Direct service start
python scripts/model_inference_service.py

# Option 3: Check system first
python scripts/start_model_service.py --check-only
\`\`\`

### 4. Start the Next.js Application

\`\`\`bash
npm run dev
\`\`\`

## Architecture Overview

The integration consists of several components:

### Python Inference Service
- **Location**: \`scripts/model_inference_service.py\`
- **Port**: 8001 (default)
- **Endpoints**:
  - \`POST /predict\` - Image classification
  - \`GET /model-info\` - Model metadata
  - \`GET /health\` - Health check

### Next.js API Integration
- **Predict API**: \`app/api/predict/route.ts\`
- **Model Info API**: \`app/api/model-info/route.ts\`
- **Metrics API**: \`app/api/metrics/route.ts\`

### Model Client
- **Location**: \`lib/model-client.ts\`
- **Purpose**: TypeScript client for Python service communication

### Status Management
- **Status Manager**: \`lib/model-status.ts\`
- **React Hook**: \`hooks/use-model-status.ts\`
- **UI Component**: \`components/model-status-indicator.tsx\`

## Model Requirements

### File Specifications
- **Filename**: \`brain_tumor_classifier.pth\`
- **Size**: ~150MB
- **Format**: PyTorch state dictionary
- **Classes**: ["Glioma", "Meningioma", "Pituitary", "No Tumor"]

### Model Architecture
Your model should match this structure:
- **Backbone**: ResNet50 (pre-trained)
- **Sequence Model**: Bidirectional GRU
- **Hidden Size**: 512
- **Layers**: 2
- **Input Size**: 224x224 RGB images

## Fallback Behavior

The system gracefully handles model unavailability:

1. **Real Model Available**: Uses CNN-GRU predictions
2. **Model Unavailable**: Falls back to simulation mode
3. **Automatic Detection**: System automatically detects model status
4. **Status Indicators**: UI shows current mode (Real/Simulation)

## Monitoring and Status

### Health Checks
- Automatic health monitoring every 30 seconds
- Manual refresh capability
- Connection testing functionality

### Status Indicators
- **Green**: Model healthy and active
- **Yellow**: Model available but with warnings
- **Red**: Model offline or unavailable

### Response Times
- Target: <3 seconds per prediction
- Monitoring: Real-time response time tracking
- Alerts: Automatic detection of slow responses

## Troubleshooting

### Common Issues

1. **Model File Not Found**
   - Ensure file is at \`models/brain_tumor_classifier.pth\`
   - Check file permissions
   - Verify file size (~150MB)

2. **Python Dependencies Missing**
   - Run: \`pip install -r scripts/requirements.txt\`
   - Check PyTorch installation
   - Verify CUDA availability (if using GPU)

3. **Service Connection Failed**
   - Check if Python service is running on port 8001
   - Verify no firewall blocking
   - Test with: \`curl http://localhost:8001/health\`

4. **Model Loading Errors**
   - Verify model architecture matches expected structure
   - Check PyTorch version compatibility
   - Ensure sufficient memory available

### Debug Commands

\`\`\`bash
# Check system requirements
python scripts/start_model_service.py --check-only

# Test model loading
python -c "from models.cnn_gru_classifier import initialize_predictor; print(initialize_predictor())"

# Test service health
curl http://localhost:8001/health

# View service logs
python scripts/model_inference_service.py --verbose
\`\`\`

## Performance Optimization

### GPU Acceleration
- Automatic CUDA detection
- Fallback to CPU if GPU unavailable
- Memory management for large models

### Caching
- Model loaded once at startup
- Preprocessing pipeline optimization
- Response caching for identical requests

### Monitoring
- Real-time performance metrics
- Processing time tracking
- Error rate monitoring

## Security Considerations

- File upload validation
- Size limits (10MB max)
- Type restrictions (JPEG, PNG, DICOM)
- Input sanitization
- Error message sanitization

## API Documentation

### Prediction Endpoint
\`\`\`typescript
POST /api/predict
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "result": {
    "predicted_class": "Glioma",
    "confidence_score": 94.2,
    "class_probabilities": {
      "Glioma": 94.2,
      "Meningioma": 3.1,
      "Pituitary": 1.8,
      "No Tumor": 0.9
    },
    "processing_time_ms": 2340,
    "inference_time": 2.34
  },
  "metadata": {
    "modelUsed": "CNN-GRU Hybrid",
    "processingMode": "real"
  }
}
\`\`\`

### Model Info Endpoint
\`\`\`typescript
GET /api/model-info

Response:
{
  "success": true,
  "model_info": {
    "model_type": "CNN-GRU Hybrid",
    "backbone": "ResNet50",
    "total_parameters": 25847296,
    "class_names": ["Glioma", "Meningioma", "Pituitary", "No Tumor"],
    "status": "deployed"
  }
}
\`\`\`

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Test individual components
4. Verify model file integrity
5. Check system requirements
