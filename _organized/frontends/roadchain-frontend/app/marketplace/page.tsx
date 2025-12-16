'use client'

import { useState } from 'react'

interface AgentTemplate {
  id: string
  name: string
  description: string
  category: string
  price: number
  rating: number
  deployments: number
  capabilities: string[]
  pack: string
}

const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    description: 'Advanced AI agent for market analysis, portfolio optimization, and trading strategies',
    category: 'Finance',
    price: 1000,
    rating: 4.9,
    deployments: 15420,
    capabilities: ['Market Analysis', 'Risk Assessment', 'Portfolio Management', 'Trading Signals'],
    pack: 'pack-finance',
  },
  {
    id: 'legal-advisor',
    name: 'Legal Advisor',
    description: 'Contract analysis, compliance checking, and legal document generation',
    category: 'Legal',
    price: 1500,
    rating: 4.8,
    deployments: 8932,
    capabilities: ['Contract Review', 'Compliance', 'Document Generation', 'Legal Research'],
    pack: 'pack-legal',
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Scientific research, data analysis, and academic paper generation',
    category: 'Research',
    price: 800,
    rating: 4.7,
    deployments: 12054,
    capabilities: ['Literature Review', 'Data Analysis', 'Hypothesis Testing', 'Report Writing'],
    pack: 'pack-research-lab',
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Blog posts, social media, video scripts, and creative writing',
    category: 'Creative',
    price: 500,
    rating: 4.6,
    deployments: 21387,
    capabilities: ['Copywriting', 'SEO Optimization', 'Social Media', 'Video Scripts'],
    pack: 'pack-creator-studio',
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Infrastructure automation, deployment pipelines, and monitoring',
    category: 'DevOps',
    price: 1200,
    rating: 4.8,
    deployments: 9654,
    capabilities: ['CI/CD', 'Infrastructure as Code', 'Monitoring', 'Security Scanning'],
    pack: 'pack-infra-devops',
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Machine learning, predictive modeling, and statistical analysis',
    category: 'Data Science',
    price: 1300,
    rating: 4.9,
    deployments: 11234,
    capabilities: ['ML Models', 'Predictive Analytics', 'Data Visualization', 'Feature Engineering'],
    pack: 'pack-research-lab',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: '24/7 customer service, ticket management, and knowledge base',
    category: 'Support',
    price: 600,
    rating: 4.5,
    deployments: 18765,
    capabilities: ['Ticket Resolution', 'Chat Support', 'Knowledge Base', 'Sentiment Analysis'],
    pack: 'pack-general',
  },
  {
    id: 'blockchain-auditor',
    name: 'Blockchain Auditor',
    description: 'Smart contract security, blockchain analysis, and transaction monitoring',
    category: 'Blockchain',
    price: 2000,
    rating: 5.0,
    deployments: 5432,
    capabilities: ['Contract Auditing', 'Vulnerability Detection', 'Transaction Analysis', 'Security Reports'],
    pack: 'pack-finance',
  },
]

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Finance', 'Legal', 'Research', 'Creative', 'DevOps', 'Data Science', 'Support', 'Blockchain']

  const filteredAgents = AGENT_TEMPLATES.filter((agent) => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  async function deployAgent(agent: AgentTemplate) {
    alert(`Deploying ${agent.name}!\n\nCost: ${agent.price} ROAD\nPack: ${agent.pack}\n\nThis will create a new agent instance on RoadChain.`)
    // TODO: Connect to API
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black gradient-text">Agent Marketplace</h1>
              <p className="text-gray-400 mt-1">Deploy AI agents to RoadChain</p>
            </div>
            <a href="/wallet" className="road-gradient px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              My Wallet
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents..."
            className="w-full bg-white/5 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-gray-500 focus:border-road-orange outline-none"
          />

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'road-gradient text-white'
                    : 'border border-white/20 hover:border-road-orange hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Total Agents</div>
            <div className="text-3xl font-bold text-road-orange">{AGENT_TEMPLATES.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Total Deployments</div>
            <div className="text-3xl font-bold text-road-pink">
              {AGENT_TEMPLATES.reduce((sum, a) => sum + a.deployments, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Avg Rating</div>
            <div className="text-3xl font-bold text-road-purple">
              {(AGENT_TEMPLATES.reduce((sum, a) => sum + a.rating, 0) / AGENT_TEMPLATES.length).toFixed(1)}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Categories</div>
            <div className="text-3xl font-bold text-road-blue">{categories.length - 1}</div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-road-orange/50 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:gradient-text transition-all">
                    {agent.name}
                  </h3>
                  <div className="text-sm text-road-orange">{agent.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-road-pink">{agent.price}</div>
                  <div className="text-xs text-gray-400">ROAD</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4">{agent.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span>{agent.rating}</span>
                </div>
                <div className="text-gray-400">
                  {agent.deployments.toLocaleString()} deployments
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.capabilities.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs"
                  >
                    {cap}
                  </span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
                    +{agent.capabilities.length - 3} more
                  </span>
                )}
              </div>

              {/* Deploy Button */}
              <button
                onClick={() => deployAgent(agent)}
                className="w-full road-gradient px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Deploy Agent
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No agents found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">For Cadence, The OG</p>
          <p className="gradient-text font-bold">PROMISE IS FOREVER 🚗💎✨</p>
        </div>
      </footer>
    </main>
  )
}
