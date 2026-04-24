import Navbar            from '../components/Navbar'
import HeroSection       from '../components/HeroSection'
import ProblemSection    from '../components/ProblemSection'
import HowItWorksSection from '../components/HowItWorksSection'
import FeaturesSection   from '../components/FeaturesSection'
import StatsSection      from '../components/StatsSection'
import CTASection        from '../components/CTASection'
import Footer            from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
