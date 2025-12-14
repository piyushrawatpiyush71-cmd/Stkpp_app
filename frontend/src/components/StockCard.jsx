import React from 'react'

function StockCard({ data }) {
  const isPositive = data.change >= 0
  
  const formatNumber = (num) => {
    if (!num) return 'N/A'
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    return num.toLocaleString()
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">{data.symbol}</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {data.exchange}
            </span>
          </div>
          <p className="text-gray-500">{data.name}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">
            {data.currency === 'INR' ? '₹' : '$'}{data.currentPrice?.toLocaleString()}
          </p>
          <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-lg font-semibold">
              {isPositive ? '+' : ''}{data.change?.toFixed(2)}
            </span>
            <span className="text-sm">
              ({isPositive ? '+' : ''}{data.changePercent?.toFixed(2)}%)
            </span>
            {isPositive ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Previous Close</p>
          <p className="font-semibold text-gray-900">
            {data.currency === 'INR' ? '₹' : '$'}{data.previousClose?.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Market Cap</p>
          <p className="font-semibold text-gray-900">{formatNumber(data.marketCap)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">52W High</p>
          <p className="font-semibold text-green-600">
            {data.currency === 'INR' ? '₹' : '$'}{data.fiftyTwoWeekHigh?.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">52W Low</p>
          <p className="font-semibold text-red-600">
            {data.currency === 'INR' ? '₹' : '$'}{data.fiftyTwoWeekLow?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StockCard
