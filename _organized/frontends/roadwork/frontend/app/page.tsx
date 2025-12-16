'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Briefcase, Zap, Target, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-8">
              <span className="text-2xl">🚗</span>
              <span className="text-orange-700 font-semibold">RoadWork</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI Career Co-Pilot
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Automated job applications across <span className="text-orange-600 font-semibold">30+ platforms</span>.
              <br />
              Get <span className="text-orange-600 font-semibold">10x more interviews</span> while you sleep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-orange-500 transition-all flex items-center justify-center gap-2"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-12 text-sm text-gray-500">
              <span className="font-semibold">Free tier:</span> 10 applications/day • No credit card required
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why RoadWork?
            </h2>
            <p className="text-xl text-gray-600">
              Job hunting on autopilot
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Apply to 100 jobs in the time it takes to apply to 1 manually"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Smart Matching"
              description="AI learns your preferences and finds perfect job matches"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="10x Results"
              description="Get 10x more employer views and interview callbacks"
            />
            <FeatureCard
              icon={<Briefcase className="w-8 h-8" />}
              title="30+ Platforms"
              description="Indeed, LinkedIn, Glassdoor, Monster, ZipRecruiter, and more"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 2 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              step="1"
              title="Sign Up"
              description="Create your account in seconds"
            />
            <StepCard
              step="2"
              title="Quick Interview"
              description="Answer a few questions about your work history"
            />
            <StepCard
              step="3"
              title="Swipe Jobs"
              description="Tinder-style job matching to find what you love"
            />
            <StepCard
              step="4"
              title="Sit Back"
              description="We apply to jobs daily and send you progress reports"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              period="/month"
              features={[
                "10 applications/day",
                "5 job platforms",
                "Basic resume builder",
                "Email summaries",
                "Application tracking"
              ]}
              cta="Get Started"
              href="/signup"
            />

            <PricingCard
              name="Pro"
              price="$20"
              period="/month"
              popular
              features={[
                "100 applications/day",
                "All 30+ platforms",
                "AI-powered customization",
                "Interview scheduler",
                "Advanced analytics",
                "Priority support"
              ]}
              cta="Start Pro Trial"
              href="/signup?plan=pro"
            />

            <PricingCard
              name="Premium"
              price="$50"
              period="/month"
              features={[
                "Unlimited applications",
                "All Pro features",
                "Custom branding",
                "API access",
                "Dedicated support",
                "White-label option"
              ]}
              cta="Start Premium"
              href="/signup?plan=premium"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful job seekers using RoadWork
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚗</span>
                <span className="font-bold text-xl">RoadWork</span>
              </div>
              <p className="text-gray-400">
                Your AI Career Co-Pilot
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/platforms">Platforms</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 RoadWork by BlackRoad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="text-orange-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function StepCard({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, period, features, cta, href, popular }: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
}) {
  return (
    <div className={`relative p-8 rounded-2xl ${popular ? 'bg-gradient-to-b from-orange-50 to-white border-2 border-orange-500 shadow-xl' : 'bg-white border border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600">{period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${
          popular
            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
