import { Brain, Github, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-foreground">NeuroWave</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Advanced AI-powered brain tumor detection platform using cutting-edge machine learning for precise medical
              diagnosis.
            </p>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">About</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                NeuroWave leverages state-of-the-art deep learning models to classify brain tumors from MRI scans with
                94.7% accuracy, helping medical professionals make faster, more accurate diagnoses.
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <div className="space-y-2">
              <a
                href="https://github.com/neurowave-ai/platform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub Repository
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Research Paper
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Medical Disclaimer
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 NeuroWave. All rights reserved. For research and educational purposes.
            </p>
            <p className="text-xs text-muted-foreground">
              Not intended for clinical diagnosis. Always consult medical professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
