import { HeroSection } from "@/components/hero-section"
import { UploadDashboard } from "@/components/upload-dashboard"
import { PerformanceAnalytics } from "@/components/performance-analytics"
import { InteractiveDemo } from "@/components/interactive-demo"
import { TechnicalDetails } from "@/components/technical-details"
import { AdvancedCharts } from "@/components/advanced-charts"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <UploadDashboard />
      <PerformanceAnalytics />
      <InteractiveDemo />
      <TechnicalDetails />
      <AdvancedCharts />
    </main>
  )
}
