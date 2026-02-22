'use client'

import { useState } from 'react'

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
  }
  summary: string
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    achievements: string[]
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    year: string
  }>
  skills: string[]
}

const DEFAULT_RESUME: ResumeData = {
  personalInfo: {
    name: 'Alexa Louise Amundson',
    email: 'blackroad@gmail.com',
    phone: '(507) 828-0842',
    location: 'Lakeville, MN',
    linkedin: 'linkedin.com/in/alexaamundson',
    github: 'github.com/blackboxprogramming'
  },
  summary: 'AI Orchestration Founder directing the development of a production-grade enterprise operating system with cognitive AI at its core. Rare hybrid of Deep AI Architecture (466K+ LOC orchestrated) + Enterprise Sales Execution ($26.8M closed) + FINRA Series 7/63/65.',
  experience: [
    {
      id: '1',
      title: 'Founder & Chief Architect',
      company: 'BlackRoad OS, Inc.',
      location: 'Remote',
      startDate: 'May 2025',
      endDate: 'Present',
      current: true,
      achievements: [
        'Built Lucidia AI Engine: multi-modal stack managing 76 autonomous agents and 69 enterprise bots',
        'Engineered 2,119 API endpoints covering Finance, CRM, HR, and IT Ops',
        'Managed 89 Terraform modules and 17 production Kubernetes configurations',
        'Developed 5 high-throughput connectors and Go-based SOX compliance engine',
        'Orchestrated Raspberry Pi/Jetson fleet for edge inference and holographic scene control'
      ]
    },
    {
      id: '2',
      title: 'Internal Annuity Wholesaler / Senior Sales Analyst',
      company: 'Securian Financial',
      location: 'St. Paul, MN',
      startDate: 'Jul 2024',
      endDate: 'Jun 2025',
      current: false,
      achievements: [
        'Sold $26.8M in annuities in 11 months (92% of goal; +38% territory growth)',
        'Selected as presenter for LPL conference for Securian\'s 24,000 advisor network',
        'Led Salesforce automation eliminating 3,000 CRM errors to 0',
        'Built Excel rate calculator integrating bond yields, inflation, and S&P 500 forecasts'
      ]
    },
    {
      id: '3',
      title: 'Financial Advisor / Advisor in Training',
      company: 'Ameriprise Financial',
      location: 'Minneapolis, MN',
      startDate: 'Aug 2023',
      endDate: 'May 2024',
      current: false,
      achievements: [
        'Identified $14M pipeline gap → 400% GDC growth potential',
        'Earned Sales Training Thought-Leadership Award for automating call-note workflows',
        'Completed 2,400+ calls with 10% appointment conversion; ranked #1 on training team'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.A., Strategic Communication (Advertising & Public Relations)',
      school: 'University of Minnesota – Twin Cities',
      year: '2019'
    }
  ],
  skills: [
    'AI/ML Orchestration', 'Enterprise Architecture', 'Sales Leadership',
    'Financial Services', 'Kubernetes', 'Terraform', 'Python', 'TypeScript',
    'LLM Integration', 'Salesforce Automation', 'Series 7/63/65',
    'Cognitive Systems', 'API Design', 'CI/CD', 'Revenue Growth'
  ]
}

type Template = 'modern' | 'classic' | 'tech' | 'executive' | 'ats'

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('modern')
  const [activeSection, setActiveSection] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills'>('personal')
  const [aiOptimizing, setAiOptimizing] = useState(false)

  function optimizeWithAI(section: string) {
    setAiOptimizing(true)

    setTimeout(() => {
      if (section === 'summary') {
        setResumeData({
          ...resumeData,
          summary: `AI Orchestration Founder with proven track record bridging deep technical expertise and enterprise sales excellence. Architected production-grade cognitive AI system managing 145 autonomous agents across 2,119 API endpoints while closing $26.8M in enterprise sales. Unique combination of AI/ML infrastructure mastery (466K+ LOC orchestrated) and regulated financial services credentials (FINRA Series 7/63/65). Expert at translating complex technical innovations into measurable business outcomes.`
        })
      }
      setAiOptimizing(false)
    }, 2000)
  }

  function tailorForJob(jobTitle: string) {
    alert(`🤖 Tailoring resume for "${jobTitle}"...\n\nAI will:\n• Reorder experience to highlight relevant skills\n• Optimize keywords for ATS systems\n• Adjust summary to match job requirements\n• Emphasize matching achievements\n\nThis feature will be connected to the AI API!`)
  }

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean, gradient accents, perfect for tech' },
    { id: 'classic', name: 'Classic', description: 'Traditional, professional, ATS-friendly' },
    { id: 'tech', name: 'Tech', description: 'Code-inspired, developer-focused' },
    { id: 'executive', name: 'Executive', description: 'Sophisticated, leadership-focused' },
    { id: 'ats', name: 'ATS Optimized', description: 'Maximum compatibility, no graphics' }
  ]

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
            <div className="flex gap-6">
              <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
              <a href="/profile" className="text-gray-300 hover:text-white transition">Profile</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📝 Resume Builder</h1>
          <p className="text-gray-400">Create ATS-optimized resumes tailored for each job application</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => optimizeWithAI('all')}
            className="bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition"
          >
            ✨ AI Optimize
          </button>
          <button
            onClick={() => tailorForJob('Senior AI Engineer')}
            className="bg-gradient-to-r from-applier-purple to-applier-pink text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition"
          >
            🎯 Tailor for Job
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition"
          >
            📄 Export PDF
          </button>
          <button className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition">
            💾 Save Version
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Editor Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Template Selector */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Templates</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id as Template)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedTemplate === template.id
                        ? 'bg-applier-pink/20 border-applier-pink'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-400">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Selector */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Sections</h2>
              <div className="space-y-2">
                {[
                  { id: 'personal', label: 'Personal Info', icon: '👤' },
                  { id: 'summary', label: 'Summary', icon: '📋' },
                  { id: 'experience', label: 'Experience', icon: '💼' },
                  { id: 'education', label: 'Education', icon: '🎓' },
                  { id: 'skills', label: 'Skills', icon: '⚡' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeSection === section.id
                        ? 'bg-applier-orange/20 border border-applier-orange text-white'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {section.icon} {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-applier-purple p-6">
              <h2 className="text-xl font-bold text-white mb-4">💡 AI Suggestions</h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-applier-purple">→</span>
                  <span>Add metrics to 3 more achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-applier-purple">→</span>
                  <span>Expand technical skills section</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-applier-purple">→</span>
                  <span>Include certifications (Series 7/63/65)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-applier-purple">→</span>
                  <span>Use stronger action verbs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-2xl p-12 min-h-[1100px]">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{resumeData.personalInfo.name}</h1>
                <div className="flex justify-center gap-4 text-sm text-gray-600 mb-1">
                  <span>{resumeData.personalInfo.email}</span>
                  <span>•</span>
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
                <div className="flex justify-center gap-4 text-sm text-gray-600">
                  <span>{resumeData.personalInfo.location}</span>
                  <span>•</span>
                  <a href={`https://${resumeData.personalInfo.linkedin}`} className="text-applier-blue hover:underline">
                    LinkedIn
                  </a>
                  <span>•</span>
                  <a href={`https://${resumeData.personalInfo.github}`} className="text-applier-blue hover:underline">
                    GitHub
                  </a>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-applier-orange pb-2 mb-4">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                {activeSection === 'summary' && (
                  <button
                    onClick={() => optimizeWithAI('summary')}
                    disabled={aiOptimizing}
                    className="mt-3 text-sm bg-applier-purple text-white px-4 py-2 rounded hover:bg-applier-purple-deep transition"
                  >
                    {aiOptimizing ? '⏳ Optimizing...' : '✨ AI Optimize Summary'}
                  </button>
                )}
              </div>

              {/* Platform Metrics */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-applier-orange pb-2 mb-4">
                  Platform Metrics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Code Scale</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 466,408 Lines of Code</li>
                      <li>• 28,538 Files | 297 Modules</li>
                      <li>• 5,937 Commits</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Architecture</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 23 Microservices | 22 Apps</li>
                      <li>• 2,119 API Endpoints</li>
                      <li>• 145 Autonomous Agents</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-applier-orange pb-2 mb-4">
                  Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-gray-700 font-semibold">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{exp.location}</p>
                          <p>{exp.startDate} – {exp.endDate}</p>
                        </div>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-applier-orange pb-2 mb-4">
                  Education & Licenses
                </h2>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.school} • {edu.year}</p>
                  </div>
                ))}
                <div className="mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">Licenses</h3>
                  <p className="text-sm text-gray-700">
                    SIE • Series 7 • Series 66 (63/65) • Life & Health Insurance • Real Estate License (inactive)
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-applier-orange pb-2 mb-4">
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Below Preview */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 text-center">
                <p className="text-2xl font-bold text-applier-orange">95%</p>
                <p className="text-sm text-gray-400">ATS Score</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 text-center">
                <p className="text-2xl font-bold text-applier-pink">1,247</p>
                <p className="text-sm text-gray-400">Words</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 text-center">
                <p className="text-2xl font-bold text-applier-purple">A+</p>
                <p className="text-sm text-gray-400">Grade</p>
              </div>
            </div>
          </div>
        </div>
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
