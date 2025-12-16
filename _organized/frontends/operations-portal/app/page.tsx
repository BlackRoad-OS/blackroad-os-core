'use client'

import { useState } from 'react'
import {
  Building2, FileText, CreditCard, Scale, Server,
  Settings, TrendingUp, AlertCircle, CheckCircle,
  DollarSign, Users, Package, Shield
} from 'lucide-react'

interface QuickStat {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: any
  color: string
}

export default function OperationsPortal() {
  const [activeSection, setActiveSection] = useState('overview')

  const quickStats: QuickStat[] = [
    {
      label: 'Monthly Revenue',
      value: '$0',
      change: '+0%',
      trend: 'neutral',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      label: 'Active Trademarks',
      value: '3',
      change: 'USPTO',
      trend: 'up',
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      label: 'Tax Documents',
      value: '12',
      change: '2024',
      trend: 'neutral',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      label: 'Infrastructure',
      value: '70+',
      change: 'Services',
      trend: 'up',
      icon: Server,
      color: 'bg-orange-500'
    }
  ]

  const sections = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      id: 'uspto',
      name: 'USPTO & Trademarks',
      icon: Shield,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950'
    },
    {
      id: 'taxes',
      name: 'Tax Documents',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      id: 'stripe',
      name: 'Stripe & Payments',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      id: 'legal',
      name: 'Legal & Contracts',
      icon: Scale,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950'
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: Server,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-blackroad rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-blackroad bg-clip-text text-transparent">
                  BlackRoad Operations
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Internal Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Alexa Amundson
              </span>
              <div className="w-8 h-8 bg-gradient-blackroad rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' :
                      stat.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-brand-orange text-brand-orange bg-orange-50 dark:bg-orange-950'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'uspto' && <USPTOSection />}
          {activeSection === 'taxes' && <TaxesSection />}
          {activeSection === 'stripe' && <StripeSection />}
          {activeSection === 'legal' && <LegalSection />}
          {activeSection === 'infrastructure' && <InfrastructureSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </div>
    </div>
  )
}

function OverviewSection() {
  const alerts = [
    { type: 'info', message: 'USPTO: ROADCOIN trademark pending (Filed: Dec 2024)', icon: Shield },
    { type: 'success', message: 'Stripe: Account active, no action needed', icon: CheckCircle },
    { type: 'warning', message: 'Tax: Q1 2025 estimated taxes due April 15', icon: AlertCircle },
    { type: 'info', message: 'Infrastructure: 70+ services deployed across Cloudflare & Railway', icon: Server }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Company Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">BlackRoad Systems - AI Agent Operating System</p>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alert.icon
            const colors = {
              info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
              success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
              warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
            }
            return (
              <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg border ${colors[alert.type as keyof typeof colors]}`}>
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-900 dark:text-white">Check USPTO Status</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
            <CreditCard className="w-6 h-6 text-green-600" />
            <span className="font-medium text-gray-900 dark:text-white">View Stripe Dashboard</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
            <FileText className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-gray-900 dark:text-white">Upload Tax Documents</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg border border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow">
            <Server className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-gray-900 dark:text-white">Infrastructure Status</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function USPTOSection() {
  const trademarks = [
    {
      name: 'BLACKROAD',
      serialNumber: 'Pending',
      status: 'Filed',
      filedDate: 'Dec 2024',
      class: 'Class 42 - Computer services',
      statusColor: 'text-yellow-600'
    },
    {
      name: 'ROADCOIN',
      serialNumber: 'Pending',
      status: 'Filed',
      filedDate: 'Dec 2024',
      class: 'Class 9 - Cryptocurrency',
      statusColor: 'text-yellow-600'
    },
    {
      name: 'ROADCHAIN',
      serialNumber: 'Pending',
      status: 'Filed',
      filedDate: 'Dec 2024',
      class: 'Class 42 - Blockchain services',
      statusColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">USPTO & Trademarks</h2>
        <p className="text-gray-600 dark:text-gray-400">Trademark registrations and intellectual property</p>
      </div>

      {/* Trademarks Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trademark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Filed Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {trademarks.map((tm, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tm.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{tm.serialNumber}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${tm.statusColor}`}>{tm.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{tm.filedDate}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{tm.class}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="https://tsdr.uspto.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow"
        >
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">USPTO TSDR</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check trademark status</p>
          </div>
        </a>
        <a
          href="https://www.uspto.gov/trademarks/apply"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-shadow"
        >
          <FileText className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">File New Trademark</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">TEAS application</p>
          </div>
        </a>
        <button className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">Track Renewals</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Set reminders</p>
          </div>
        </button>
      </div>
    </div>
  )
}

function TaxesSection() {
  const taxDocuments = [
    { year: '2024', type: 'W-9', status: 'Filed', date: 'Jan 2024' },
    { year: '2024', type: 'Quarterly Estimated (Q1)', status: 'Paid', date: 'Apr 2024' },
    { year: '2024', type: 'Quarterly Estimated (Q2)', status: 'Paid', date: 'Jun 2024' },
    { year: '2024', type: 'Quarterly Estimated (Q3)', status: 'Paid', date: 'Sep 2024' },
    { year: '2024', type: 'Quarterly Estimated (Q4)', status: 'Paid', date: 'Dec 2024' },
    { year: '2025', type: 'Quarterly Estimated (Q1)', status: 'Due Apr 15', date: 'Upcoming' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tax Documents</h2>
        <p className="text-gray-600 dark:text-gray-400">W-9, 1099s, quarterly estimated taxes, and annual filings</p>
      </div>

      {/* Tax Calendar */}
      <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2025 Tax Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Q1 Estimated (2024)</span>
            <span className="text-sm text-yellow-600">Apr 15, 2025</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Q2 Estimated (2025)</span>
            <span className="text-sm text-gray-600">Jun 16, 2025</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Q3 Estimated (2025)</span>
            <span className="text-sm text-gray-600">Sep 15, 2025</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Q4 Estimated (2025)</span>
            <span className="text-sm text-gray-600">Jan 15, 2026</span>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {taxDocuments.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{doc.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{doc.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    doc.status.includes('Due') ? 'text-yellow-600' :
                    doc.status === 'Paid' || doc.status === 'Filed' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{doc.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Tax Documents</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <button className="px-4 py-2 bg-gradient-blackroad text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
          Choose Files
        </button>
      </div>
    </div>
  )
}

function StripeSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stripe & Payments</h2>
        <p className="text-gray-600 dark:text-gray-400">Payment processing, subscriptions, and revenue analytics</p>
      </div>

      {/* Stripe Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All time</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Subscriptions</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">MRR: $0</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</span>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ready to sell</p>
        </div>
      </div>

      {/* Stripe Account Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stripe Account</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
            <span className="flex items-center text-sm font-medium text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Payouts</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Test Mode</span>
            <span className="text-sm font-medium text-yellow-600">Active</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
        >
          <CreditCard className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Open Stripe Dashboard</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage payments & customers</p>
          </div>
        </a>
        <button className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
          <Package className="w-6 h-6 text-blue-600" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">Create Product</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add new subscription tier</p>
          </div>
        </button>
      </div>

      {/* Integration Status */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stripe Integration</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Webhook endpoints configured</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Payment methods enabled</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Customer portal active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegalSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Legal & Contracts</h2>
        <p className="text-gray-600 dark:text-gray-400">Terms of service, privacy policy, and legal documents</p>
      </div>

      {/* Legal Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Terms of Service</h3>
            <span className="text-xs text-green-600 font-medium">Current</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Last updated: Dec 2024</p>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Document →</button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Privacy Policy</h3>
            <span className="text-xs text-green-600 font-medium">Current</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Last updated: Dec 2024</p>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Document →</button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Operating Agreement</h3>
            <span className="text-xs text-green-600 font-medium">Filed</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Delaware LLC</p>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Document →</button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Employee Agreements</h3>
            <span className="text-xs text-gray-600">Templates</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">NDAs, contracts</p>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Templates →</button>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Legal Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">BlackRoad Systems LLC</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">Limited Liability Company (LLC)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Jurisdiction</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">Delaware</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">EIN</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">XX-XXXXXXX</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfrastructureSection() {
  const services = [
    { name: 'Cloudflare Pages', count: 38, status: 'operational', cost: '$0/mo' },
    { name: 'Railway Services', count: 10, status: 'operational', cost: '$20-40/mo' },
    { name: 'Cloudflare Workers', count: 3, status: 'operational', cost: '$0/mo' },
    { name: 'KV Namespaces', count: 92, status: 'operational', cost: '$0/mo' },
    { name: 'D1 Databases', count: 16, status: 'operational', cost: '$0/mo' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Infrastructure</h2>
        <p className="text-gray-600 dark:text-gray-400">Cloudflare, Railway, and multi-cloud deployments</p>
      </div>

      {/* Infrastructure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</span>
            <Server className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">70+</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Across all platforms</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Cost</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$20-40</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Estimated</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Services</h3>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{service.count} instances</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{service.cost}</p>
                <p className="text-xs text-green-600 capitalize">{service.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://dash.cloudflare.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow"
        >
          <Server className="w-6 h-6 text-orange-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Cloudflare Dashboard</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage Pages, Workers, KV</p>
          </div>
        </a>
        <a
          href="https://railway.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow"
        >
          <Server className="w-6 h-6 text-purple-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Railway Dashboard</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage backend services</p>
          </div>
        </a>
      </div>
    </div>
  )
}

function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Portal configuration and preferences</p>
      </div>

      {/* User Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              defaultValue="Alexa Amundson"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              defaultValue="amundsonalexa@gmail.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700 dark:text-gray-300">USPTO status updates</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700 dark:text-gray-300">Tax deadline reminders</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700 dark:text-gray-300">Stripe payment notifications</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700 dark:text-gray-300">Infrastructure alerts</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4">Danger Zone</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          These actions are irreversible. Please be certain.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
          Reset All Data
        </button>
      </div>
    </div>
  )
}
