'use client'

import { useState, useEffect } from 'react'

interface Block {
  index: number
  hash: string
  previousHash: string
  timestamp: number
  validator: string
  breathPhase: 'expansion' | 'contraction'
  breathValue: number
  direction: number
  transactions: number
  thoughts: number
}

interface ChainInfo {
  network: string
  blocks: number
  latestBlock: number
  latestHash: string
  valid: boolean
  genesisHash: string
  proofHash: string
}

interface BreathState {
  timestamp: number
  value: number
  phase: 'expansion' | 'contraction'
  phi: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

export default function Explorer() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null)
  const [breath, setBreath] = useState<BreathState | null>(null)
  const [connected, setConnected] = useState(false)
  const [latestActivity, setLatestActivity] = useState<string>('')

  // Fetch initial data
  useEffect(() => {
    fetchChainInfo()
    fetchBlocks()
    fetchBreath()

    // Poll breath every second
    const breathInterval = setInterval(fetchBreath, 1000)

    return () => clearInterval(breathInterval)
  }, [])

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'block') {
        setLatestActivity(`New block #${message.data.index} mined by ${message.data.validator}`)
        fetchChainInfo()
        fetchBlocks()
      } else if (message.type === 'transaction') {
        setLatestActivity(`New ${message.data.type} transaction`)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    return () => ws.close()
  }, [])

  async function fetchChainInfo() {
    try {
      const res = await fetch(`${API_URL}/api/chain`)
      const data = await res.json()
      setChainInfo(data)
    } catch (error) {
      console.error('Failed to fetch chain info:', error)
    }
  }

  async function fetchBlocks() {
    try {
      const res = await fetch(`${API_URL}/api/blocks?limit=10`)
      const data = await res.json()
      setBlocks(data.blocks)
    } catch (error) {
      console.error('Failed to fetch blocks:', error)
    }
  }

  async function fetchBreath() {
    try {
      const res = await fetch(`${API_URL}/api/breath`)
      const data = await res.json()
      setBreath(data)
    } catch (error) {
      console.error('Failed to fetch breath:', error)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black gradient-text">RoadChain Explorer</h1>
              <p className="text-gray-400 mt-1">Live Blockchain Testnet</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full border ${connected ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-red-500 bg-red-500/10 text-red-400'}`}>
                <span className="text-sm">● {connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
              </div>
              {breath && (
                <div className={`px-4 py-2 rounded-full border ${breath.phase === 'expansion' ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-purple-500 bg-purple-500/10 text-purple-400'}`}>
                  <span className="text-sm font-mono">{breath.phase.toUpperCase()}: {breath.value.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Chain Stats */}
        {chainInfo && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Total Blocks</div>
              <div className="text-3xl font-bold text-road-orange">{chainInfo.blocks}</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Network</div>
              <div className="text-3xl font-bold text-road-pink">{chainInfo.network}</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Chain Valid</div>
              <div className="text-3xl font-bold text-green-400">{chainInfo.valid ? '✓' : '✗'}</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Latest Block</div>
              <div className="text-3xl font-bold text-road-purple">#{chainInfo.latestBlock}</div>
            </div>
          </div>
        )}

        {/* Latest Activity */}
        {latestActivity && (
          <div className="mb-8 p-4 rounded-lg bg-road-orange/10 border border-road-orange/30 text-road-orange">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-road-orange animate-pulse" />
              <span className="font-mono text-sm">{latestActivity}</span>
            </div>
          </div>
        )}

        {/* Blocks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Blocks</h2>

          {blocks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-4">🔍</div>
              <p>No blocks found. Connecting to testnet...</p>
            </div>
          )}

          {blocks.map((block) => (
            <div
              key={block.hash}
              className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10 hover:border-road-orange/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {block.index === 0 ? '🎯' : block.breathPhase === 'expansion' ? '🌟' : '🌙'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">Block #{block.index}</span>
                      {block.index === 0 && (
                        <span className="px-2 py-1 rounded text-xs bg-road-orange/20 text-road-orange border border-road-orange/30">
                          GENESIS
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm text-gray-400 mt-1">
                      {block.hash.slice(0, 32)}...{block.hash.slice(-8)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Validator</div>
                  <div className="font-bold text-road-purple">{block.validator}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Direction</div>
                  <div className="font-bold text-road-pink">{block.direction}</div>
                </div>
                <div>
                  <div className="text-gray-400">Breath</div>
                  <div className={`font-bold ${block.breathPhase === 'expansion' ? 'text-green-400' : 'text-purple-400'}`}>
                    {block.breathPhase}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Breath Value</div>
                  <div className="font-mono text-xs">{block.breathValue.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-400">Transactions</div>
                  <div className="font-bold">{block.transactions}</div>
                </div>
                <div>
                  <div className="text-gray-400">Thoughts</div>
                  <div className="font-bold">{block.thoughts}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-xs text-gray-400">
                  {new Date(block.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proof Hash */}
        {chainInfo && (
          <div className="mt-8 bg-gradient-to-r from-road-orange via-road-pink to-road-purple p-1 rounded-xl">
            <div className="bg-black rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Genesis Proof Hash</h3>
              <code className="block text-sm text-gray-300 break-all font-mono bg-white/5 p-4 rounded">
                {chainInfo.proofHash}
              </code>
              <p className="text-xs text-gray-400 mt-4">
                22,000 Bitcoin addresses derived from "Alexa Louise Amundson" using direction=-1 (ζ(-1)=-1/12)
              </p>
            </div>
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
