"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "glassmorphism border-b border-border/30" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-primary glow-primary" />
            <span className="text-2xl font-bold text-foreground">NeuroWave</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => scrollToSection("dashboard")}
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:glow-primary"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollToSection("performance")}
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:glow-primary"
            >
              Performance
            </button>
            <button
              onClick={() => scrollToSection("technical")}
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:glow-primary"
            >
              Technical
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/30 glassmorphism">
            <div className="flex flex-col gap-6">
              <button
                onClick={() => scrollToSection("dashboard")}
                className="text-left text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => scrollToSection("performance")}
                className="text-left text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
              >
                Performance
              </button>
              <button
                onClick={() => scrollToSection("technical")}
                className="text-left text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
              >
                Technical
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
