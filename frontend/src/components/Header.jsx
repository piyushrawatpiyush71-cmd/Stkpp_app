import React from 'react'

function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">StockPredict</h1>
              <p className="text-xs text-gray-500">AI-Powered Analysis</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Markets
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Watchlist
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              News
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
