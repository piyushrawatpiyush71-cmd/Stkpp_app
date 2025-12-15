import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const searchStocks = async (query) => {
  try {
    const response = await api.get(
      `/stock/search?q=${encodeURIComponent(query)}`
    )
    return response.data.results
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to search stocks')
  }
}

export const fetchStockData = async (symbol, period = '1mo') => {
  try {
    const response = await api.get(
      `/stock/${symbol}?period=${period}`
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch stock data')
  }
}

export const fetchLivePrice = async (symbol) => {
  try {
    const response = await api.get(`/stock/${symbol}/live`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch live price')
  }
}

export const fetchPrediction = async (symbol, days = 7) => {
  try {
    const response = await api.get(
      `/stock/${symbol}/predict?days=${days}`
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get prediction')
  }
}

export const fetchAnalysis = async (symbol) => {
  try {
    const response = await api.get(`/stock/${symbol}/analyze`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get analysis')
  }
}

export const fetchNseStocks = async () => {
  try {
    const response = await api.get('/nse/stocks')
    return response.data.stocks
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch NSE stocks')
  }
  }
