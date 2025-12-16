'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Briefcase,
  TrendingUp,
  Eye,
  Mail,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    jobsFound: 0,
    applicationsSubmitted: 0,
    employerViews: 0,
    interviews: 0,
    viewRate: 0,
  })

  const [recentApplications, setRecentApplications] = useState<any[]>([])

  useEffect(() => {
    // Fetch dashboard data from API
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Mock data for now
    setStats({
      jobsFound: 156,
      applicationsSubmitted: 82,
      employerViews: 48,
      interviews: 5,
      viewRate: 0.59,
    })

    setRecentApplications([
      {
        id: '1',
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Corp',
        status: 'submitted',
        appliedAt: '2025-01-15T10:00:00Z',
        viewed: true,
      },
      {
        id: '2',
        jobTitle: 'Lead Developer',
        company: 'Startup Inc',
        status: 'interview',
        appliedAt: '2025-01-14T15:30:00Z',
        viewed: true,
      },
      {
        id: '3',
        jobTitle: 'Full Stack Engineer',
        company: 'Digital Agency',
        status: 'pending',
        appliedAt: '2025-01-14T09:00:00Z',
        viewed: false,
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                RoadWork
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-orange-600 font-medium">
                Dashboard
              </Link>
              <Link href="/applications" className="text-gray-600 hover:text-gray-900">
                Applications
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </Link>
              <button className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 mb-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, Jane! 👋
          </h1>
          <p className="text-white/90 text-lg">
            Your job hunt is on autopilot. Here's what's happening...
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Briefcase className="w-6 h-6" />}
            label="Jobs Found This Month"
            value={stats.jobsFound}
            trend="+12%"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Applications Submitted"
            value={stats.applicationsSubmitted}
            trend="+8%"
          />
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            label="Employer Views"
            value={stats.employerViews}
            trend="+15%"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Interviews Scheduled"
            value={stats.interviews}
            trend="+20%"
          />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Applications
                </h2>
                <Link
                  href="/applications"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Insights */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Performance Insights
              </h3>

              <div className="space-y-4">
                <InsightItem
                  title="View Rate"
                  value={`${Math.round(stats.viewRate * 100)}%`}
                  description="of applications viewed by employers"
                  positive
                />
                <InsightItem
                  title="Best Platform"
                  value="LinkedIn"
                  description="65% response rate"
                  positive
                />
                <InsightItem
                  title="Peak Time"
                  value="6-9 AM"
                  description="for faster responses"
                  positive
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <QuickActionButton
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Run Job Search"
                  href="/search"
                />
                <QuickActionButton
                  icon={<Settings className="w-5 h-5" />}
                  label="Update Preferences"
                  href="/settings"
                />
                <QuickActionButton
                  icon={<Mail className="w-5 h-5" />}
                  label="View Emails"
                  href="/emails"
                />
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Pro Plan
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                8 of 100 applications used today
              </p>
              <div className="w-full bg-white/50 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full" style={{ width: '8%' }} />
              </div>
              <Link
                href="/settings/billing"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Manage Subscription →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: number
  trend: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-orange-500">{icon}</div>
        <span className="text-sm font-medium text-green-600">{trend}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  )
}

function ApplicationCard({ application }: { application: any }) {
  const statusConfig = {
    submitted: {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      text: 'Submitted',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    pending: {
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      text: 'Pending Review',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    interview: {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      text: 'Interview Scheduled',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  }

  const status = statusConfig[application.status as keyof typeof statusConfig]

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            {application.jobTitle}
          </h4>
          <p className="text-sm text-gray-600">{application.company}</p>
        </div>
        {application.viewed && (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <Eye className="w-4 h-4" />
            <span>Viewed</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
          {status.icon}
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(application.appliedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

function InsightItem({
  title,
  value,
  description,
  positive,
}: {
  title: string
  value: string
  description: string
  positive?: boolean
}) {
  return (
    <div className="border-l-4 border-orange-500 pl-4">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm text-gray-600">{title}</span>
        <span className={`font-bold ${positive ? 'text-green-600' : 'text-gray-900'}`}>
          {value}
        </span>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}

function QuickActionButton({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
    >
      <div className="text-orange-500">{icon}</div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
    </Link>
  )
}
