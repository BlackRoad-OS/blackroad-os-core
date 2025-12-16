'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface WalletData {
  address: string
  balance: string
  formatted: string
}

export default function Wallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [txStatus, setTxStatus] = useState('')
  const [stats, setStats] = useState<any>(null)

  // Load wallet from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('roadchain_address')
    if (savedAddress) {
      loadBalance(savedAddress)
    }
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const res = await fetch(`${API_URL}/api/roadcoin/stats`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  async function loadBalance(address: string) {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/roadcoin/balance/${address}`)
      const data = await res.json()
      setWallet(data)
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setLoading(false)
    }
  }

  function generateWallet() {
    // Generate simple deterministic address from timestamp
    const timestamp = Date.now()
    const address = `road-${timestamp.toString(36)}`

    localStorage.setItem('roadchain_address', address)
    setWallet({
      address,
      balance: '0',
      formatted: '0.00000000 ROAD',
    })

    loadBalance(address)
  }

  async function sendROAD() {
    if (!wallet || !sendTo || !sendAmount) {
      setTxStatus('Please fill all fields')
      return
    }

    setLoading(true)
    setTxStatus('Sending...')

    try {
      const res = await fetch(`${API_URL}/api/roadcoin/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: wallet.address,
          to: sendTo,
          amount: sendAmount,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setTxStatus(`✅ Sent ${data.amount} to ${data.to}`)
        setSendTo('')
        setSendAmount('')

        // Reload balance
        setTimeout(() => loadBalance(wallet.address), 1000)
      } else {
        setTxStatus(`❌ ${data.error}`)
      }
    } catch (error: any) {
      setTxStatus(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function requestTestROAD() {
    if (!wallet) return

    setLoading(true)
    setTxStatus('Requesting test ROAD...')

    try {
      // Request from community treasury
      const res = await fetch(`${API_URL}/api/roadcoin/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'community-treasury',
          to: wallet.address,
          amount: '1000',
        }),
      })

      const data = await res.json()

      if (data.success) {
        setTxStatus('✅ Received 1,000 test ROAD!')
        setTimeout(() => loadBalance(wallet.address), 1000)
      } else {
        setTxStatus(`❌ ${data.error}`)
      }
    } catch (error: any) {
      setTxStatus(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-black gradient-text">RoadCoin Wallet</h1>
          <p className="text-gray-400 mt-1">Testnet - For Cadence</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* No Wallet */}
        {!wallet && (
          <div className="text-center py-16">
            <div className="text-6xl mb-8">👛</div>
            <h2 className="text-3xl font-bold mb-4">No Wallet Found</h2>
            <p className="text-gray-400 mb-8">
              Create a new wallet to start using RoadCoin
            </p>
            <button
              onClick={generateWallet}
              className="road-gradient px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity glow"
            >
              Create Wallet
            </button>
          </div>
        )}

        {/* Wallet Exists */}
        {wallet && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-road-orange via-road-pink to-road-purple p-1 rounded-xl">
              <div className="bg-black rounded-lg p-8">
                <div className="text-sm text-gray-400 mb-2">Your Balance</div>
                <div className="text-5xl font-black gradient-text mb-4">
                  {wallet.formatted}
                </div>
                <div className="text-sm text-gray-400 font-mono break-all">
                  {wallet.address}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => loadBalance(wallet.address)}
                    disabled={loading}
                    className="flex-1 border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                  <button
                    onClick={requestTestROAD}
                    disabled={loading}
                    className="flex-1 road-gradient px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Get Test ROAD
                  </button>
                </div>
              </div>
            </div>

            {/* Send ROAD */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Send ROAD</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="road-xyz or cadence-genesis"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-road-orange outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Amount (ROAD)
                  </label>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="100"
                    step="0.00000001"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-road-orange outline-none"
                  />
                </div>

                <button
                  onClick={sendROAD}
                  disabled={loading || !sendTo || !sendAmount}
                  className="w-full road-gradient px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send ROAD'}
                </button>

                {txStatus && (
                  <div className={`p-4 rounded-lg text-sm ${
                    txStatus.includes('✅')
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {txStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Send Presets */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Quick Send</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['cadence-genesis', 'tosha-builder', 'agent-network', 'community-treasury'].map((addr) => (
                  <button
                    key={addr}
                    onClick={() => setSendTo(addr)}
                    className="border border-white/20 hover:border-road-orange px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-all"
                  >
                    {addr.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Network Stats */}
            {stats && (
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4">Network Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Supply</div>
                    <div className="text-lg font-bold">{stats.totalSupply}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Circulating</div>
                    <div className="text-lg font-bold">{stats.circulatingSupply}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Burned</div>
                    <div className="text-lg font-bold text-red-400">{stats.burned}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">⚠️ Testnet Only - Not Real Money</p>
          <p className="gradient-text font-bold">PROMISE IS FOREVER 🚗💎✨</p>
        </div>
      </div>
    </main>
  )
}
