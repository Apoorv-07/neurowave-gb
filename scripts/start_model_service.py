#!/usr/bin/env python3
"""
Startup script for the NeuroWave Brain Tumor Classification Service
Handles dependency checking, model validation, and service initialization.
"""

import sys
import os
import subprocess
import importlib.util
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are installed."""
    required_packages = [
        'torch',
        'torchvision', 
        'numpy',
        'PIL',
        'sklearn'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        if package == 'PIL':
            # PIL is imported as PIL but installed as Pillow
            spec = importlib.util.find_spec('PIL')
        else:
            spec = importlib.util.find_spec(package)
            
        if spec is None:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n📦 Install missing packages with:")
        print("   pip install -r scripts/requirements.txt")
        return False
    
    print("✅ All dependencies are installed")
    return True

def check_model_file():
    """Check if the trained model file exists."""
    model_path = Path("models/brain_tumor_classifier.pth")
    
    if not model_path.exists():
        print("❌ Model file not found!")
        print(f"   Expected location: {model_path.absolute()}")
        print("\n📋 To fix this:")
        print("   1. Place your trained model file at: models/brain_tumor_classifier.pth")
        print("   2. Ensure the file is approximately 150MB")
        print("   3. Verify it's a PyTorch state dictionary (.pth file)")
        return False
    
    # Check file size (should be around 150MB)
    file_size_mb = model_path.stat().st_size / (1024 * 1024)
    print(f"✅ Model file found ({file_size_mb:.1f} MB)")
    
    if file_size_mb < 50:
        print("⚠️  Warning: Model file seems small. Expected ~150MB")
    elif file_size_mb > 500:
        print("⚠️  Warning: Model file seems large. Expected ~150MB")
    
    return True

def check_pytorch_device():
    """Check PyTorch device availability."""
    try:
        import torch
        
        if torch.cuda.is_available():
            device = "CUDA GPU"
            gpu_name = torch.cuda.get_device_name(0)
            print(f"🚀 GPU acceleration available: {gpu_name}")
        else:
            device = "CPU"
            print("💻 Using CPU for inference")
        
        return True
        
    except ImportError:
        print("❌ PyTorch not available")
        return False

def start_service(port=8001):
    """Start the inference service."""
    print(f"\n🧠 Starting NeuroWave Brain Tumor Classification Service...")
    print(f"🌐 Service will be available at: http://localhost:{port}")
    print("🔄 Loading model and starting server...\n")
    
    try:
        # Import and start the service
        from model_inference_service import start_inference_server
        return start_inference_server(port)
        
    except ImportError as e:
        print(f"❌ Failed to import inference service: {e}")
        return False
    except Exception as e:
        print(f"❌ Failed to start service: {e}")
        return False

def main():
    """Main startup routine."""
    print("🧠 NeuroWave Brain Tumor Classification Service")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check PyTorch
    if not check_pytorch_device():
        sys.exit(1)
    
    # Check model file
    if not check_model_file():
        sys.exit(1)
    
    print("\n🎯 All checks passed! Starting service...")
    
    # Start the service
    if not start_service():
        print("❌ Failed to start service")
        sys.exit(1)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="NeuroWave Model Service Startup")
    parser.add_argument("--port", type=int, default=8001, help="Server port (default: 8001)")
    parser.add_argument("--check-only", action="store_true", help="Only run checks, don't start service")
    
    args = parser.parse_args()
    
    if args.check_only:
        print("🔍 Running system checks only...")
        check_dependencies()
        check_pytorch_device() 
        check_model_file()
        print("✅ Check complete")
    else:
        main()
