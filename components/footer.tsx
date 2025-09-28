"use client"

import { useEffect } from "react"
import { Brain, Github, ExternalLink, Heart } from "lucide-react"

export function Footer() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <footer className="relative bg-background border-t border-border/30">
      <div className="absolute inset-0 opacity-5">
        <div className="neural-network"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="fade-in-up space-y-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary glow-primary" />
              <span className="text-2xl font-bold text-foreground">NeuroWave</span>
            </div>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              Revolutionary AI-powered brain tumor detection platform using cutting-edge machine learning for precise
              medical diagnosis and real-time insights.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for medical advancement</span>
            </div>
          </div>

          <div className="fade-in-up space-y-6">
            <h3 className="text-lg font-bold text-foreground">About NeuroWave</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                NeuroWave leverages state-of-the-art deep learning models to classify brain tumors from MRI scans with
                94.7% accuracy, helping medical professionals make faster, more accurate diagnoses.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Real-time processing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Clinical-grade accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">HIPAA compliant</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-in-up space-y-6">
            <h3 className="text-lg font-bold text-foreground">Resources</h3>
            <div className="space-y-4">
              <a
                href="https://github.com/neurowave-ai/platform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <Github className="w-5 h-5 group-hover:glow-primary" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
              >
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">D</span>
                </div>
                <span>Dataset Information</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="fade-in-left">
              <p className="text-muted-foreground text-center lg:text-left">
                © 2025 NeuroWave AI. All rights reserved. For research and educational purposes.
              </p>
            </div>
            <div className="fade-in-right">
              <p className="text-xs text-muted-foreground text-center lg:text-right max-w-md">
                Not intended for clinical diagnosis. Always consult qualified medical professionals. This platform is
                designed to assist, not replace, professional medical judgment.
              </p>
            </div>
          </div>
          </div>

          <div className="fade-in-up mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Website created by Apoorv Singh</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>DL Model by Tushar Goutam</span>
            </div>
        </div>
      </div>
    </footer>
  )
}
