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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">NeuroWave</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("dashboard")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollToSection("performance")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Performance
            </button>
            <button
              onClick={() => scrollToSection("technical")}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("dashboard")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => scrollToSection("performance")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                Performance
              </button>
              <button
                onClick={() => scrollToSection("technical")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
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
