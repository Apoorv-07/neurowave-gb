import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { UploadDashboard } from "@/components/upload-dashboard"
import { PerformanceAnalytics } from "@/components/performance-analytics"
import { InteractiveDemo } from "@/components/interactive-demo"
import { TechnicalDetails } from "@/components/technical-details"
import { AdvancedCharts } from "@/components/advanced-charts"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <UploadDashboard />
        <PerformanceAnalytics />
        <InteractiveDemo />
        <TechnicalDetails />
        <AdvancedCharts />
      </main>
      <Footer />
    </>
  )
}
