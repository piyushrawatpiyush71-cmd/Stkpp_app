import React, { useState, useEffect, useCallback } from 'react'
import { fetchLivePrice } from '../services/api'

function LivePrice({ symbol }) {
  const [liveData, setLiveData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchPrice = useCallback(async () => {
    if (!symbol) return
    
    setLoading(true)
    try {
      const data = await fetchLivePrice(symbol)
      setLiveData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch live price:', error)
    } finally {
      setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [fetchPrice])

  if (!symbol) return null

  const isPositive = liveData?.change >= 0

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Live Price</h3>
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          )}
          <button
            onClick={fetchPrice}
            disabled={loading}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {liveData ? (
        <div className="space-y-4">
          <div className="text-center py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {liveData.currency === 'INR' ? '₹' : '$'}{liveData.price?.toLocaleString()}
            </p>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPositive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{isPositive ? '+' : ''}{liveData.changePercent?.toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-gray-500 text-xs">Open</p>
              <p className="font-semibold">{liveData.currency === 'INR' ? '₹' : '$'}{liveData.open?.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-gray-500 text-xs">Volume</p>
              <p className="font-semibold">{(liveData.volume / 1e6).toFixed(2)}M</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2.5">
              <p className="text-gray-500 text-xs">High</p>
              <p className="font-semibold text-green-700">{liveData.currency === 'INR' ? '₹' : '$'}{liveData.high?.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2.5">
              <p className="text-gray-500 text-xs">Low</p>
              <p className="font-semibold text-red-700">{liveData.currency === 'INR' ? '₹' : '$'}{liveData.low?.toLocaleString()}</p>
            </div>
          </div>

          {lastUpdate && (
            <p className="text-xs text-gray-400 text-center">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-sm">Loading live data...</p>
        </div>
      )}
    </div>
  )
}

export default LivePrice
