# In scripts/main.py

import sys
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add parent directory to path to import the classifier
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# This imports your existing model code
from models.cnn_gru_classifier import initialize_predictor, get_predictor

# --- FastAPI App Initialization ---
app = FastAPI(title="NeuroWave Model API")

# --- CORS Middleware ---
# This allows your Vercel frontend to communicate with this Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- API Endpoints ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Handles image upload and returns model prediction."""
    predictor = get_predictor()
    if not predictor:
        raise HTTPException(status_code=503, detail="Model is not available")
    
    try:
        image_data = await file.read()
        result = predictor.predict(image_data)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
def model_info():
    """Returns information about the loaded model."""
    predictor = get_predictor()
    if not predictor:
        return {"status": "Model not initialized"}
    return predictor.get_model_info()

@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    predictor = get_predictor()
    status = "healthy" if predictor else "unhealthy"
    return {"status": status}

# --- Server Startup Logic ---
@app.on_event("startup")
async def startup_event():
    """Initializes the model predictor when the server starts."""
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'brain_tumor_classifier.pth')
    print("Initializing model...")
    if not initialize_predictor(model_path):
        print("FATAL: Model initialization failed.")
    else:
        print("Model initialized successfully.")
