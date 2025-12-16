'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Upload, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react'

type OnboardingStep = 'welcome' | 'name' | 'upload' | 'swipe' | 'complete'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [formData, setFormData] = useState({
    name: '',
    namePronunciation: '',
    uploadedFile: null as File | null,
  })

  const steps: OnboardingStep[] = ['welcome', 'name', 'upload', 'swipe', 'complete']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, uploadedFile: e.target.files[0] })
    }
  }

  const handleComplete = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboarding_completed', 'true')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
        />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 pt-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {currentStep === 'welcome' && (
              <WelcomeStep key="welcome" onNext={handleNext} />
            )}

            {currentStep === 'name' && (
              <NameStep
                key="name"
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 'upload' && (
              <UploadStep
                key="upload"
                formData={formData}
                onFileUpload={handleFileUpload}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 'swipe' && (
              <SwipeStep
                key="swipe"
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 'complete' && (
              <CompleteStep
                key="complete"
                onComplete={handleComplete}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-8">
        <span className="text-6xl">🚗</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to RoadWork!
      </h1>

      <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
        Let's get you set up in just <span className="text-orange-600 font-semibold">2 minutes</span>.
        I'll ask you a few quick questions to personalize your job hunt.
      </p>

      <button
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-2 mx-auto"
      >
        Let's Get Started
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

function NameStep({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any
  setFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 text-orange-500 mb-4">
          <Sparkles className="w-6 h-6" />
          <span className="font-semibold">Step 1 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What's your name?
        </h2>
        <p className="text-gray-600">
          This helps me personalize your experience
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How do you pronounce it?
          </label>
          <input
            type="text"
            value={formData.namePronunciation}
            onChange={(e) => setFormData({ ...formData, namePronunciation: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="jayn doh"
          />
          <p className="mt-1 text-xs text-gray-500">
            This helps us get your name right in communications
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-orange-500 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!formData.name}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

function UploadStep({
  formData,
  onFileUpload,
  onNext,
  onBack,
}: {
  formData: any
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 text-orange-500 mb-4">
          <Sparkles className="w-6 h-6" />
          <span className="font-semibold">Step 2 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Your Work History
        </h2>
        <p className="text-gray-600">
          Any format works - resume, LinkedIn PDF, or even a long text document
        </p>
      </div>

      <div className="mb-8">
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-500 transition-all">
            {formData.uploadedFile ? (
              <div>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {formData.uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  Click to upload a different file
                </p>
              </div>
            ) : (
              <div>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOCX, TXT up to 10MB
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={onFileUpload}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-orange-500 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!formData.uploadedFile}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

function SwipeStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const jobCategories = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'Design',
    'Marketing',
    'Sales',
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<string[]>([])

  const handleLike = () => {
    setLiked([...liked, jobCategories[currentIndex]])
    if (currentIndex < jobCategories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onNext()
    }
  }

  const handleDislike = () => {
    if (currentIndex < jobCategories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 text-orange-500 mb-4">
          <Sparkles className="w-6 h-6" />
          <span className="font-semibold">Step 3 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What interests you?
        </h2>
        <p className="text-gray-600">
          Swipe right on roles you're interested in
        </p>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {jobCategories[currentIndex]}
          </h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDislike}
              className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <span className="text-3xl">👎</span>
            </button>
            <button
              onClick={handleLike}
              className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <span className="text-3xl">👍</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          {currentIndex + 1} of {jobCategories.length}
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-orange-500 transition-all flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
    </motion.div>
  )
}

function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-8">
        <span className="text-6xl">🎉</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        You're All Set!
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
        Your AI career co-pilot is ready to start applying to jobs on your behalf.
      </p>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">We'll search for jobs matching your preferences</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">Daily automated applications will start tomorrow</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">You'll receive daily progress reports via email</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-2 mx-auto"
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}
