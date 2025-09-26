import torch
import torch.nn as nn
from torchvision import models, transforms
from torchvision.models import ResNet50_Weights
import numpy as np
from PIL import Image
import io
import json
import time
from typing import Dict, List, Tuple, Optional

class CNN_GRU_Classifier(nn.Module):
    """
    Hybrid CNN-GRU model for brain tumor classification.
    - CNN (ResNet50) extracts spatial features.
    - GRU processes these features sequentially to classify.
    """
    def __init__(self, num_classes: int = 4, hidden_size: int = 512, num_layers: int = 2):
        super(CNN_GRU_Classifier, self).__init__()
        
        # Load pre-trained ResNet50 and remove the final classification layer
        resnet = models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
        self.features = nn.Sequential(*list(resnet.children())[:-2])
        
        # Freeze the early layers of ResNet to retain learned features
        for param in self.features[:6].parameters():
            param.requires_grad = False
            
        # GRU layer
        self.gru = nn.GRU(
            input_size=2048,  # ResNet50 feature dimension
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True  # Using a bidirectional GRU
        )
        
        # Final classifier
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size * 2, 256),  # *2 because of bidirectional
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        # 1. Extract features using the CNN (ResNet)
        x = self.features(x)
        # Output shape: (batch_size, 2048, 7, 7)

        # 2. Prepare the tensor for the GRU
        batch_size, channels, height, width = x.size()
        
        # Flatten the height and width dimensions into a single sequence dimension
        x = x.view(batch_size, channels, height * width)
        
        # Transpose to make the sequence dimension the second dimension for the GRU
        x = x.permute(0, 2, 1)

        # 3. Process the sequence with the GRU
        gru_out, _ = self.gru(x)

        # 4. Use the output of the last time step for classification
        last_hidden_state = gru_out[:, -1, :]

        # 5. Pass through the final classifier
        output = self.classifier(last_hidden_state)
        return output


class BrainTumorPredictor:
    """
    Main predictor class that handles model loading, preprocessing, and inference.
    """
    
    def __init__(self, model_path: str, device: Optional[str] = None):
        self.model_path = model_path
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.class_names = ["Glioma", "Meningioma", "Pituitary", "No Tumor"]
        self.model = None
        self.transform = self._get_transform()
        
    def _get_transform(self):
        """Get the preprocessing transform for input images."""
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def load_model(self) -> bool:
        """Load the trained model from the specified path."""
        try:
            self.model = CNN_GRU_Classifier(
                num_classes=len(self.class_names),
                hidden_size=512,
                num_layers=2
            )
            
            # Load the trained weights
            state_dict = torch.load(self.model_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            self.model.to(self.device)
            self.model.eval()
            
            print(f"Model loaded successfully on {self.device}")
            return True
            
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False
    
    def preprocess_image(self, image_data: bytes) -> torch.Tensor:
        """Preprocess the input image for model inference."""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Apply transforms
            image_tensor = self.transform(image)
            
            # Add batch dimension
            image_tensor = image_tensor.unsqueeze(0)
            
            return image_tensor.to(self.device)
            
        except Exception as e:
            raise ValueError(f"Error preprocessing image: {str(e)}")
    
    def predict(self, image_data: bytes) -> Dict:
        """
        Perform inference on the input image.
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            Dictionary containing prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        start_time = time.time()
        
        try:
            # Preprocess the image
            image_tensor = self.preprocess_image(image_data)
            
            # Perform inference
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                
                # Get predictions
                confidence_scores = probabilities.cpu().numpy()[0]
                predicted_class_idx = np.argmax(confidence_scores)
                predicted_class = self.class_names[predicted_class_idx]
                confidence_score = float(confidence_scores[predicted_class_idx]) * 100
                
                # Create class probabilities dictionary
                class_probabilities = {
                    class_name: float(score * 100) 
                    for class_name, score in zip(self.class_names, confidence_scores)
                }
                
                processing_time = time.time() - start_time
                
                return {
                    "predicted_class": predicted_class,
                    "confidence_score": round(confidence_score, 2),
                    "class_probabilities": {k: round(v, 2) for k, v in class_probabilities.items()},
                    "processing_time_ms": round(processing_time * 1000),
                    "inference_time": round(processing_time, 3)
                }
                
        except Exception as e:
            raise RuntimeError(f"Error during prediction: {str(e)}")
    
    def get_model_info(self) -> Dict:
        """Get information about the loaded model."""
        if self.model is None:
            return {"status": "Model not loaded"}
        
        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        
        return {
            "model_type": "CNN-GRU Hybrid",
            "backbone": "ResNet50",
            "sequence_model": "Bidirectional GRU",
            "num_classes": len(self.class_names),
            "class_names": self.class_names,
            "total_parameters": total_params,
            "trainable_parameters": trainable_params,
            "device": self.device,
            "input_size": "224x224",
            "status": "loaded"
        }


# Global predictor instance
predictor = None

def initialize_predictor(model_path: str = "models/brain_tumor_classifier.pth") -> bool:
    """Initialize the global predictor instance."""
    global predictor
    try:
        predictor = BrainTumorPredictor(model_path)
        return predictor.load_model()
    except Exception as e:
        print(f"Failed to initialize predictor: {str(e)}")
        return False

def get_predictor() -> Optional[BrainTumorPredictor]:
    """Get the global predictor instance."""
    return predictor
