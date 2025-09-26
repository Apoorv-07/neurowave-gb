#!/usr/bin/env python3
"""
Brain Tumor Classification Inference Service
Provides a simple HTTP server for model inference using the CNN-GRU classifier.
"""

import sys
import os
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
from typing import Dict, Any

# Add the models directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

try:
    from cnn_gru_classifier import BrainTumorPredictor, initialize_predictor
except ImportError as e:
    print(f"Error importing model: {e}")
    print("Make sure PyTorch and other dependencies are installed")
    sys.exit(1)

class InferenceHandler(BaseHTTPRequestHandler):
    """HTTP request handler for model inference."""
    
    def do_POST(self):
        """Handle POST requests for model inference."""
        try:
            if self.path == '/predict':
                self._handle_predict()
            elif self.path == '/model-info':
                self._handle_model_info()
            else:
                self._send_error(404, "Endpoint not found")
                
        except Exception as e:
            print(f"Error handling request: {str(e)}")
            self._send_error(500, f"Internal server error: {str(e)}")
    
    def do_GET(self):
        """Handle GET requests."""
        if self.path == '/health':
            self._handle_health()
        elif self.path == '/model-info':
            self._handle_model_info()
        else:
            self._send_error(404, "Endpoint not found")
    
    def _handle_predict(self):
        """Handle prediction requests."""
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._send_error(400, "No image data provided")
                return
            
            # Read the image data
            image_data = self.rfile.read(content_length)
            
            # Get the predictor
            predictor = get_predictor()
            if predictor is None:
                self._send_error(500, "Model not initialized")
                return
            
            # Perform prediction
            result = predictor.predict(image_data)
            
            # Send response
            self._send_json_response(200, {
                "success": True,
                "result": result,
                "timestamp": time.time()
            })
            
        except Exception as e:
            self._send_error(500, f"Prediction failed: {str(e)}")
    
    def _handle_model_info(self):
        """Handle model info requests."""
        try:
            predictor = get_predictor()
            if predictor is None:
                info = {"status": "Model not initialized"}
            else:
                info = predictor.get_model_info()
            
            self._send_json_response(200, info)
            
        except Exception as e:
            self._send_error(500, f"Failed to get model info: {str(e)}")
    
    def _handle_health(self):
        """Handle health check requests."""
        predictor = get_predictor()
        status = "healthy" if predictor is not None else "unhealthy"
        
        self._send_json_response(200, {
            "status": status,
            "timestamp": time.time()
        })
    
    def _send_json_response(self, status_code: int, data: Dict[str, Any]):
        """Send a JSON response."""
        response_data = json.dumps(data, indent=2)
        
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response_data)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        self.wfile.write(response_data.encode('utf-8'))
    
    def _send_error(self, status_code: int, message: str):
        """Send an error response."""
        self._send_json_response(status_code, {
            "success": False,
            "error": message,
            "timestamp": time.time()
        })
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to customize logging."""
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")


def start_inference_server(port: int = 8001, model_path: str = "models/brain_tumor_classifier.pth"):
    """Start the inference server."""
    print(f"Initializing Brain Tumor Classification Service...")
    print(f"Model path: {model_path}")
    
    # Initialize the predictor
    if not initialize_predictor(model_path):
        print("Failed to initialize model. Exiting.")
        return False
    
    print("Model loaded successfully!")
    
    # Start the HTTP server
    server_address = ('localhost', port)
    httpd = HTTPServer(server_address, InferenceHandler)
    
    print(f"Starting inference server on http://localhost:{port}")
    print("Available endpoints:")
    print(f"  POST http://localhost:{port}/predict - Image classification")
    print(f"  GET  http://localhost:{port}/model-info - Model information")
    print(f"  GET  http://localhost:{port}/health - Health check")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()
        return True


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Brain Tumor Classification Inference Service")
    parser.add_argument("--port", type=int, default=8001, help="Server port (default: 8001)")
    parser.add_argument("--model", type=str, default="models/brain_tumor_classifier.pth", 
                       help="Path to the trained model file")
    
    args = parser.parse_args()
    
    # Check if model file exists
    if not os.path.exists(args.model):
        print(f"Error: Model file not found at {args.model}")
        print("Please ensure your trained model is placed in the correct location.")
        sys.exit(1)
    
    start_inference_server(args.port, args.model)
