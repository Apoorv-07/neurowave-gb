import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Activity, Zap, Users } from "lucide-react"

// Mock data representing dynamic model metrics
const modelMetrics = {
  accuracy: 97.94,
  processingTime: 2.3,
  numClasses: 4,
  totalSamples: 7022,
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-accent/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-primary/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-accent/20 rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">NeuroWave</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </a>
          <a href="#performance" className="text-muted-foreground hover:text-foreground transition-colors">
            Performance
          </a>
          <a href="#technical" className="text-muted-foreground hover:text-foreground transition-colors">
            Technical
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Medical Diagnostics</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-balance mb-6">
            <span className="text-foreground">NeuroWave</span>
            <br />
            <span className="text-primary">AI-Powered Brain</span>
            <br />
            <span className="text-accent">Tumor Detection</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-12 max-w-2xl mx-auto">
            Advanced machine learning platform for precise brain tumor classification from MRI scans. Empowering medical
            professionals with cutting-edge AI diagnostics.
          </p>

          {/* Dynamic Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="card-gradient border-border/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Model Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{modelMetrics.accuracy}%</div>
            </Card>

            <Card className="card-gradient border-border/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Processing Time</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{modelMetrics.processingTime}s</div>
            </Card>

            <Card className="card-gradient border-border/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Tumor Types</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{modelMetrics.numClasses}</div>
            </Card>

            <Card className="card-gradient border-border/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Training Samples</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{modelMetrics.totalSamples.toLocaleString()}</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="relative z-10 border-t border-border/50 py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by </p>
          <div className="flex items-center justify-center gap-12 opacity-60">
            <div className="text-lg font-semibold">Nitin Kumar</div>
            <div className="text-lg font-semibold">Apoorv Singh</div>
            <div className="text-lg font-semibold">Tushar Goutam</div>
          </div>
        </div>
      </div>
    </section>
  )
}
