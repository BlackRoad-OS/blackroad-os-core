'use client'

import { useState } from 'react'

interface Contact {
  id: string
  name: string
  title: string
  company: string
  location: string
  connectionLevel: '1st' | '2nd' | '3rd'
  sharedConnections: number
  canRefer: boolean
  avatar?: string
}

interface Message {
  id: string
  type: 'connection' | 'referral' | 'follow-up' | 'cold-outreach'
  subject: string
  body: string
  tone: 'professional' | 'friendly' | 'enthusiastic'
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Engineering Manager',
    company: 'Anthropic',
    location: 'San Francisco, CA',
    connectionLevel: '2nd',
    sharedConnections: 12,
    canRefer: true
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'VP of Sales',
    company: 'OpenAI',
    location: 'New York, NY',
    connectionLevel: '2nd',
    sharedConnections: 8,
    canRefer: true
  },
  {
    id: '3',
    name: 'Emily Watson',
    title: 'Senior ML Engineer',
    company: 'Google DeepMind',
    location: 'London, UK',
    connectionLevel: '3rd',
    sharedConnections: 3,
    canRefer: false
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Head of AI',
    company: 'Meta',
    location: 'Menlo Park, CA',
    connectionLevel: '2nd',
    sharedConnections: 15,
    canRefer: true
  }
]

export default function NetworkPage() {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messageType, setMessageType] = useState<'connection' | 'referral' | 'follow-up' | 'cold-outreach'>('connection')
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  function generateMessage() {
    if (!selectedContact) return

    const messages: Record<string, Message> = {
      connection: {
        id: '1',
        type: 'connection',
        subject: 'Connecting on AI & Sales',
        body: `Hi ${selectedContact.name},

I came across your profile and was impressed by your work at ${selectedContact.company}. I'm Alexa Amundson, founder of BlackRoad OS, where I'm building a production-grade cognitive AI system.

I have a unique background combining deep AI architecture (466K+ LOC orchestrated, 2,119 API endpoints) with enterprise sales ($26.8M closed at Securian Financial) and financial services credentials (Series 7/63/65).

I'd love to connect and exchange insights on AI infrastructure, enterprise sales, or the intersection of technical innovation and business outcomes.

Looking forward to connecting!

Best,
Alexa
linkedin.com/in/alexaamundson`,
        tone: 'professional'
      },
      referral: {
        id: '2',
        type: 'referral',
        subject: `Referral Request - ${targetRole || 'AI Engineer'} at ${selectedContact.company}`,
        body: `Hi ${selectedContact.name},

I hope this message finds you well! I'm reaching out because I'm very interested in the ${targetRole || 'AI Engineer'} position at ${selectedContact.company}.

My background is a rare hybrid:
• Deep AI Architecture: Built BlackRoad OS with 76 autonomous agents, 23 microservices, 2,119 API endpoints
• Enterprise Sales: $26.8M closed in 11 months, 92% of goal, +38% territory growth
• Financial Services: FINRA Series 7/63/65 licensed

I believe my combination of technical depth (466K LOC orchestrated) and proven ability to close complex B2B sales would be valuable to ${selectedContact.company}'s mission.

Would you be open to referring me or connecting me with the hiring manager? I'd be happy to send over my resume and discuss how my experience aligns with the role.

Thank you for considering!

Best regards,
Alexa Amundson
(507) 828-0842
blackroad@gmail.com`,
        tone: 'professional'
      },
      'follow-up': {
        id: '3',
        type: 'follow-up',
        subject: 'Following up on my application',
        body: `Hi ${selectedContact.name},

I wanted to follow up on my application for the ${targetRole || 'position'} at ${selectedContact.company}. I'm very excited about the opportunity to contribute to your team.

Since applying, I've been thinking about how my experience could add value:
• AI Infrastructure: 89 Terraform modules, 17 production K8s configs, 437 CI/CD workflows
• Sales Execution: Led Salesforce automation initiatives eliminating 3,000+ CRM errors
• Technical Leadership: Orchestrated 145 autonomous agents across distributed systems

I'd love the chance to discuss how I can help ${selectedContact.company} achieve its goals. Would you have 15 minutes for a brief call this week?

Thank you for your time!

Best,
Alexa`,
        tone: 'enthusiastic'
      },
      'cold-outreach': {
        id: '4',
        type: 'cold-outreach',
        subject: 'AI + Sales Hybrid Background',
        body: `Hi ${selectedContact.name},

I'm reaching out cold, but I think you'll find my background interesting given your work at ${selectedContact.company}.

I'm building BlackRoad OS, a cognitive AI system managing 145 autonomous agents. What makes me unique: I've also closed $26.8M in enterprise sales and hold Series 7/63/65 licenses.

This rare combination lets me bridge technical innovation with business outcomes—something I believe is valuable in the AI space.

I'd love to learn more about what you're building at ${selectedContact.company} and explore if there are ways we could collaborate or if you're hiring for roles that blend technical and commercial expertise.

Open to a 15-minute call whenever works for you.

Best,
Alexa Amundson
Founder, BlackRoad OS
linkedin.com/in/alexaamundson`,
        tone: 'friendly'
      }
    }

    setGeneratedMessage(messages[messageType].body)
  }

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <a href="/jobs" className="text-gray-300 hover:text-white transition">Jobs</a>
              <a href="/interview" className="text-gray-300 hover:text-white transition">Interview</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🤝 Networking Hub</h1>
          <p className="text-gray-400">AI-powered connection messages, referral requests, and outreach automation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Connections</h3>
            <p className="text-4xl font-bold text-gradient">487</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Messages Sent</h3>
            <p className="text-4xl font-bold text-applier-orange">23</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Referrals</h3>
            <p className="text-4xl font-bold text-applier-pink">5</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Response Rate</h3>
            <p className="text-4xl font-bold text-applier-purple">42%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contacts List */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contacts</h2>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4 focus:border-applier-pink focus:outline-none text-sm"
              />

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedContact?.id === contact.id
                        ? 'bg-applier-pink/20 border-applier-pink'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{contact.name}</h3>
                        <p className="text-xs text-gray-400">{contact.title}</p>
                        <p className="text-xs text-applier-orange">{contact.company}</p>
                      </div>
                      {contact.canRefer && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          Can Refer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{contact.connectionLevel}</span>
                      <span>•</span>
                      <span>{contact.sharedConnections} mutual</span>
                    </div>
                  </button>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-applier-orange to-applier-pink text-white font-semibold rounded-lg hover:shadow-lg transition">
                🔍 Find More Contacts
              </button>
            </div>
          </div>

          {/* Message Generator */}
          <div className="md:col-span-2 space-y-6">
            {!selectedContact ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-12 text-center">
                <p className="text-gray-400 text-lg">👈 Select a contact to generate a message</p>
              </div>
            ) : (
              <>
                {/* Contact Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedContact.name}</h2>
                      <p className="text-lg text-gray-400">{selectedContact.title}</p>
                      <p className="text-lg text-applier-orange font-semibold">{selectedContact.company}</p>
                      <p className="text-sm text-gray-500 mt-2">📍 {selectedContact.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        selectedContact.connectionLevel === '1st' ? 'bg-green-500/20 text-green-400' :
                        selectedContact.connectionLevel === '2nd' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {selectedContact.connectionLevel} Connection
                      </span>
                      <p className="text-sm text-gray-500 mt-2">{selectedContact.sharedConnections} mutual connections</p>
                    </div>
                  </div>

                  {selectedContact.canRefer && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm">✅ This person can likely refer you at {selectedContact.company}</p>
                    </div>
                  )}
                </div>

                {/* Message Type & Settings */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Message Settings</h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Message Type</label>
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value as any)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                      >
                        <option value="connection">Connection Request</option>
                        <option value="referral">Referral Request</option>
                        <option value="follow-up">Follow-up Message</option>
                        <option value="cold-outreach">Cold Outreach</option>
                      </select>
                    </div>

                    {(messageType === 'referral' || messageType === 'follow-up') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
                          <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="Senior AI Engineer"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={generateMessage}
                    className="w-full bg-gradient-to-r from-applier-orange to-applier-pink text-white font-bold py-4 rounded-lg hover:shadow-lg transition"
                  >
                    ✨ Generate Message
                  </button>
                </div>

                {/* Generated Message */}
                {generatedMessage && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-applier-pink p-6">
                    <h3 className="text-xl font-bold text-white mb-4">📧 Generated Message</h3>
                    <textarea
                      value={generatedMessage}
                      onChange={(e) => setGeneratedMessage(e.target.value)}
                      rows={15}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-applier-pink focus:outline-none font-mono text-sm mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedMessage)}
                        className="flex-1 bg-gradient-to-r from-applier-purple to-applier-pink text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                      >
                        📋 Copy to Clipboard
                      </button>
                      <button className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition">
                        📤 Send via LinkedIn
                      </button>
                      <button className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition">
                        ✉️ Send via Email
                      </button>
                    </div>
                  </div>
                )}

                {/* Networking Tips */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">💡 Networking Tips</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-applier-pink">•</span>
                      <span>Personalize every message - mention specific projects or posts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-applier-pink">•</span>
                      <span>Lead with value - how can you help them?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-applier-pink">•</span>
                      <span>Follow up within 48 hours of connecting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-applier-pink">•</span>
                      <span>Use your unique hybrid background as a differentiator</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-applier-pink">•</span>
                      <span>Ask for 15-minute calls, not "coffee chats"</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
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
