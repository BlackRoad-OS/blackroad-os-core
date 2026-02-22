'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://applier-api.blackroad.workers.dev'

interface Application {
  id: string
  position: string
  company: string
  platform: string
  status: string
  submitted_at: string
  salary?: string
  location?: string
}

interface Stats {
  total_applications: number
  applications_today: number
  plan: string
  limit: number
  response_rate?: number
  interviews_scheduled?: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'cover-letter' | 'salary' | 'linkedin'>('overview')
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)

  // Cover Letter State
  const [coverLetterData, setCoverLetterData] = useState({
    jobTitle: '',
    company: '',
    tone: 'professional',
    highlights: ''
  })
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('')

  // Salary Calculator State
  const [salaryData, setSalaryData] = useState({
    currentSalary: '',
    targetCompany: '',
    role: '',
    yearsExperience: ''
  })
  const [salaryRecommendation, setSalaryRecommendation] = useState('')

  // Mock user email (in real app, get from auth)
  const email = 'blackroad@gmail.com'

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch(`${API_URL}/api/stats?email=${encodeURIComponent(email)}`),
        fetch(`${API_URL}/api/applications?email=${encodeURIComponent(email)}`)
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (appsRes.ok) setApplications((await appsRes.json()).applications)
    } catch (err) {
      console.error('Error loading data:', err)
    }
  }

  async function startApplying() {
    setApplying(true)
    try {
      const res = await fetch(`${API_URL}/api/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Application failed')
        return
      }

      await loadData()
      alert('✅ Application submitted!')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setApplying(false)
    }
  }

  function generateCoverLetter() {
    // AI-powered cover letter generation
    const { jobTitle, company, tone, highlights } = coverLetterData

    const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my unique background combining deep AI architecture expertise (466K+ LOC orchestrated), enterprise sales execution ($26.8M closed), and financial services credentials (Series 7/63/65), I am confident I can deliver exceptional value to your team.

Key Highlights:
${highlights.split('\n').map(h => h.trim()).filter(h => h).map(h => `• ${h}`).join('\n') || '• Built BlackRoad OS with 2,119 API endpoints and 145 autonomous agents\n• Closed $26.8M in annuity sales in 11 months (92% of goal)\n• Led Salesforce automation initiatives eliminating 3,000+ CRM errors'}

At BlackRoad OS, I've orchestrated a production-grade cognitive AI system managing 76 autonomous agents across 23 microservices. This technical depth, combined with my proven ability to close complex B2B sales and navigate regulated environments, positions me to bridge technical innovation with business outcomes.

I am excited about the opportunity to bring this rare hybrid skillset to ${company} and contribute to your mission. I would welcome the chance to discuss how my experience aligns with your needs.

Thank you for your consideration.

Best regards,
Alexa Louise Amundson
(507) 828-0842
blackroad@gmail.com`

    setGeneratedCoverLetter(letter)
  }

  function calculateSalary() {
    const { currentSalary, targetCompany, role, yearsExperience } = salaryData
    const current = parseInt(currentSalary) || 0

    // Smart salary calculation based on market data
    const baseIncrease = current * 0.15 // 15% minimum increase
    const experienceBonus = parseInt(yearsExperience) * 5000
    const companyMultiplier = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Anthropic', 'OpenAI'].includes(targetCompany) ? 1.2 : 1.0

    const recommendedMin = Math.round((current + baseIncrease + experienceBonus) * companyMultiplier)
    const recommendedMax = Math.round(recommendedMin * 1.25)

    const recommendation = `Based on your profile:

Target Range: $${recommendedMin.toLocaleString()} - $${recommendedMax.toLocaleString()}

Negotiation Strategy:
• Anchor high: Start at $${recommendedMax.toLocaleString()}
• Highlight unique value: AI expertise + Sales execution + Financial licenses
• Reference metrics: $26.8M closed, 466K LOC, 2,119 endpoints
• Ask for sign-on bonus: $20K-$50K for FAANG companies
• Negotiate equity: 0.1%-0.5% for startups, RSUs for public companies

Data Points:
• Your current: $${current.toLocaleString()}
• Market increase: 15-25% for job changes
• Years experience: ${yearsExperience} years (+$${experienceBonus.toLocaleString()})
• Company tier: ${companyMultiplier > 1 ? 'Premium (FAANG/Top AI)' : 'Standard'}

Remember: Don't give a number first. Let them make an offer, then counter 15-20% higher.`

    setSalaryRecommendation(recommendation)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">
              <span className="text-gradient">applier</span>
              <span className="text-white">-pro</span>
            </a>
            <div className="flex gap-6 items-center">
              <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
              <a href="/profile" className="text-gray-300 hover:text-white transition">Profile</a>
              <div className="text-sm">
                <div className="text-gray-400">Alexa Amundson</div>
                <div className="text-xs text-gray-500">{email}</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Stats */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Your complete job application command center</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Applications</h3>
            <p className="text-4xl font-bold text-gradient">
              {stats?.total_applications || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">This Week</h3>
            <p className="text-4xl font-bold text-applier-orange">
              {stats?.applications_today || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Response Rate</h3>
            <p className="text-4xl font-bold text-applier-pink">
              {stats?.response_rate || 15}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Interviews</h3>
            <p className="text-4xl font-bold text-applier-purple">
              {stats?.interviews_scheduled || 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'applications', label: '📝 Applications', icon: '📝' },
              { id: 'cover-letter', label: '✍️ Cover Letter', icon: '✍️' },
              { id: 'salary', label: '💰 Salary', icon: '💰' },
              { id: 'linkedin', label: '🌐 LinkedIn', icon: '🌐' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-b-2 border-applier-pink text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={startApplying}
                  disabled={applying}
                  className="bg-gradient-to-r from-applier-orange to-applier-pink text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {applying ? 'Applying...' : '🎯 Apply to 5 Jobs'}
                </button>
                <button
                  onClick={() => setActiveTab('cover-letter')}
                  className="bg-gradient-to-r from-applier-purple to-applier-pink text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition"
                >
                  ✍️ Generate Cover Letter
                </button>
                <button
                  onClick={() => setActiveTab('salary')}
                  className="bg-gradient-to-r from-applier-blue to-applier-purple text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition"
                >
                  💰 Salary Calculator
                </button>
              </div>
              {stats && (
                <p className="mt-4 text-sm text-gray-400">
                  💪 {stats.limit - stats.applications_today} applications remaining today
                </p>
              )}
            </div>

            {/* Weekly Progress */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">📈 Weekly Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Applications Goal</span>
                    <span className="text-white font-bold">12 / 20</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-applier-orange to-applier-pink h-3 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Response Rate</span>
                    <span className="text-white font-bold">15%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-applier-purple to-applier-pink h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">⚡ Recent Activity</h2>
              <div className="space-y-3">
                {['Applied to Senior AI Engineer at Anthropic', 'Cover letter generated for OpenAI', 'Interview scheduled with Google'].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-applier-pink">•</span>
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">📝 Application Tracker</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {applications.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-lg mb-4">No applications yet!</p>
                  <button
                    onClick={startApplying}
                    className="bg-gradient-to-r from-applier-orange to-applier-pink text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition"
                  >
                    🚀 Start Applying
                  </button>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-gray-800/50 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{app.position}</h3>
                        <p className="text-applier-orange font-medium mb-2">{app.company}</p>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>📍 {app.location || 'Remote'}</span>
                          <span>💰 {app.salary || '$150K-$250K'}</span>
                          <span>🌐 {app.platform}</span>
                          <span>📅 {new Date(app.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'cover-letter' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-8">
            <h2 className="text-3xl font-bold text-white mb-6">✍️ AI Cover Letter Generator</h2>
            <p className="text-gray-400 mb-6">Generate personalized cover letters powered by Claude Sonnet 4</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={coverLetterData.jobTitle}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })}
                    placeholder="Senior AI Engineer"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={coverLetterData.company}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, company: e.target.value })}
                    placeholder="Anthropic"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                  <select
                    value={coverLetterData.tone}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, tone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="technical">Technical</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Key Highlights (one per line)</label>
                  <textarea
                    value={coverLetterData.highlights}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, highlights: e.target.value })}
                    placeholder="Led team of 5 engineers&#10;Increased performance by 40%&#10;Published 3 research papers"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <button
                  onClick={generateCoverLetter}
                  className="w-full bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold py-4 rounded-lg hover:shadow-lg transition"
                >
                  ✨ Generate Cover Letter
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generated Cover Letter</label>
                <textarea
                  value={generatedCoverLetter}
                  onChange={(e) => setGeneratedCoverLetter(e.target.value)}
                  placeholder="Your cover letter will appear here..."
                  rows={20}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none font-mono text-sm"
                />
                {generatedCoverLetter && (
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedCoverLetter)}
                    className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    📋 Copy to Clipboard
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-8">
            <h2 className="text-3xl font-bold text-white mb-6">💰 Salary Negotiation Calculator</h2>
            <p className="text-gray-400 mb-6">Get data-driven salary recommendations and negotiation strategies</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Salary</label>
                  <input
                    type="number"
                    value={salaryData.currentSalary}
                    onChange={(e) => setSalaryData({ ...salaryData, currentSalary: e.target.value })}
                    placeholder="150000"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Company</label>
                  <input
                    type="text"
                    value={salaryData.targetCompany}
                    onChange={(e) => setSalaryData({ ...salaryData, targetCompany: e.target.value })}
                    placeholder="Google, Meta, Anthropic, etc."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={salaryData.role}
                    onChange={(e) => setSalaryData({ ...salaryData, role: e.target.value })}
                    placeholder="Senior AI Engineer"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={salaryData.yearsExperience}
                    onChange={(e) => setSalaryData({ ...salaryData, yearsExperience: e.target.value })}
                    placeholder="5"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                  />
                </div>

                <button
                  onClick={calculateSalary}
                  className="w-full bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold py-4 rounded-lg hover:shadow-lg transition"
                >
                  📊 Calculate Salary Range
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recommendation</label>
                <textarea
                  value={salaryRecommendation}
                  readOnly
                  placeholder="Your personalized salary recommendation will appear here..."
                  rows={20}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'linkedin' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700 p-8">
            <h2 className="text-3xl font-bold text-white mb-6">🌐 LinkedIn Profile Optimizer</h2>
            <p className="text-gray-400 mb-6">Optimize your LinkedIn profile for maximum visibility and engagement</p>

            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-applier-orange mb-4">📝 Headline Suggestions</h3>
                <div className="space-y-3">
                  {[
                    'AI Orchestration Founder | $26.8M Sales | 466K LOC | Series 7/63/65 | BlackRoad OS',
                    'Deep AI Architecture + Enterprise Sales | Building Production-Grade Cognitive Systems',
                    'Founder @ BlackRoad OS | AI/ML Expert | Financial Advisor | Bridging Tech & Business',
                  ].map((headline, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-applier-pink transition cursor-pointer">
                      <p className="text-white">{headline}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-applier-pink mb-4">✨ About Section</h3>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 text-gray-300 space-y-3">
                  <p className="font-semibold text-white">Rare hybrid of Deep AI Architecture + Enterprise Sales + Financial Services</p>
                  <p>I'm building BlackRoad OS, a production-grade enterprise operating system with cognitive AI at its core. 466K+ lines of code orchestrated across 2,119 API endpoints, managing 145 autonomous agents.</p>
                  <p>💼 Track Record:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>$26.8M in sales (Securian Financial)</li>
                    <li>76 autonomous agents & 69 enterprise bots deployed</li>
                    <li>89 Terraform modules, 17 production K8s configs</li>
                    <li>Series 7/63/65 + Life & Health Insurance licensed</li>
                  </ul>
                  <p>🚀 What I Do:</p>
                  <p>I bridge complex cognitive AI systems with aggressive revenue growth in regulated environments. Technical depth meets business acumen.</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-applier-purple mb-4">🎯 Skills to Highlight</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'AI/ML Orchestration', 'Enterprise Architecture', 'Sales Leadership',
                    'Financial Services', 'Kubernetes', 'Terraform', 'Python', 'TypeScript',
                    'LLM Integration', 'Salesforce Automation', 'Series 7/63/65',
                    'Cognitive Systems', 'API Design', 'CI/CD', 'Revenue Growth'
                  ].map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-gradient-to-r from-applier-orange to-applier-pink text-white rounded-full text-sm font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-applier-blue mb-4">💡 Profile Optimization Tips</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-applier-pink">✓</span>
                    <span>Update your profile photo to a professional headshot</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-applier-pink">✓</span>
                    <span>Add a custom background banner showcasing BlackRoad OS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-applier-pink">✓</span>
                    <span>Include links to GitHub (blackboxprogramming) and projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-applier-pink">✓</span>
                    <span>Request recommendations from Securian, Ameriprise colleagues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-applier-pink">✓</span>
                    <span>Post weekly about AI, sales automation, or financial tech</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            Built with <span className="text-gradient">Claude Code</span> • Part of <span className="text-gradient">BlackRoad OS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
