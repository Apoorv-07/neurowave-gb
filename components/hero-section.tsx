"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Activity, Zap, Users, ArrowDown } from "lucide-react"

// Mock data representing dynamic model metrics
const modelMetrics = {
  accuracy: 94.7,
  processingTime: 2.3,
  numClasses: 4,
  totalSamples: 15420,
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={heroRef} className="relative min-h-screen hero-gradient overflow-hidden">
      <div className="neural-network"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-accent/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-primary/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-accent/30 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="fade-in-up inline-flex items-center gap-2 px-6 py-3 rounded-full card-glassmorphism border border-primary/20 mb-8">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">Next-Generation AI Medical Diagnostics</span>
          </div>

          <h1 className="fade-in-up text-6xl lg:text-8xl font-bold text-balance mb-8 leading-tight">
            <span className="text-foreground">NeuroWave</span>
            <br />
            <span className="text-primary glow-primary">AI-Powered</span>
            <br />
            <span className="text-accent glow-accent">Brain Analysis</span>
          </h1>

          <p className="fade-in-up text-xl lg:text-2xl text-muted-foreground text-balance mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary machine learning platform delivering precise brain tumor classification from MRI scans.
            Empowering medical professionals with cutting-edge AI diagnostics and real-time insights.
          </p>

          <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button
              size="lg"
              className="btn-glow px-8 py-4 text-lg font-semibold"
              onClick={() => scrollToSection("dashboard")}
            >
              <Brain className="w-5 h-5 mr-2" />
              Start Analysis
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="btn-glow-accent px-8 py-4 text-lg font-semibold border-accent/50 text-accent hover:bg-accent/10 bg-transparent"
              onClick={() => scrollToSection("performance")}
            >
              View Performance
            </Button>
          </div>

          <div className="fade-in-up grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            <Card className="card-glassmorphism border-primary/20 p-6 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">Model Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{modelMetrics.accuracy}%</div>
            </Card>

            <Card className="card-glassmorphism border-accent/20 p-6 hover:border-accent/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-accent" />
                <span className="text-sm text-muted-foreground font-medium">Processing Time</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{modelMetrics.processingTime}s</div>
            </Card>

            <Card className="card-glassmorphism border-primary/20 p-6 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-6 h-6 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">Tumor Types</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{modelMetrics.numClasses}</div>
            </Card>

            <Card className="card-glassmorphism border-accent/20 p-6 hover:border-accent/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-accent" />
                <span className="text-sm text-muted-foreground font-medium">Training Samples</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{modelMetrics.totalSamples.toLocaleString()}</div>
            </Card>
          </div>

          <div className="fade-in-up">
            <Button variant="ghost" size="sm" className="animate-bounce" onClick={() => scrollToSection("dashboard")}>
              <ArrowDown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-border/30 py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="fade-in-up text-center text-sm text-muted-foreground mb-12 font-medium">
            Trusted by leading medical institutions worldwide
          </p>
          <div className="fade-in-up flex items-center justify-center gap-16 opacity-60">
            <div className="text-xl font-semibold">Mayo Clinic</div>
            <div className="text-xl font-semibold">Johns Hopkins</div>
            <div className="text-xl font-semibold">Cleveland Clinic</div>
            <div className="text-xl font-semibold">Mass General</div>
          </div>
        </div>
      </div>
    </section>
  )
}
