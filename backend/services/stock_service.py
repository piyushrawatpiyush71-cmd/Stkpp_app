import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json

class StockService:
    def __init__(self):
        self.popular_stocks = [
            {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ"},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "exchange": "NASDAQ"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ"},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "exchange": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ"},
            {"symbol": "META", "name": "Meta Platforms Inc.", "exchange": "NASDAQ"},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "exchange": "NASDAQ"},
            {"symbol": "JPM", "name": "JPMorgan Chase & Co.", "exchange": "NYSE"},
            {"symbol": "V", "name": "Visa Inc.", "exchange": "NYSE"},
            {"symbol": "WMT", "name": "Walmart Inc.", "exchange": "NYSE"},
            {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "exchange": "NSE"},
            {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "exchange": "NSE"},
            {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "exchange": "NSE"},
            {"symbol": "INFY.NS", "name": "Infosys", "exchange": "NSE"},
            {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "exchange": "NSE"},
            {"symbol": "SBIN.NS", "name": "State Bank of India", "exchange": "NSE"},
            {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "exchange": "NSE"},
            {"symbol": "ITC.NS", "name": "ITC Limited", "exchange": "NSE"},
            {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "exchange": "NSE"},
            {"symbol": "LT.NS", "name": "Larsen & Toubro", "exchange": "NSE"},
        ]
    
    def search_stocks(self, query):
        query = query.upper()
        results = []
        
        for stock in self.popular_stocks:
            if query in stock["symbol"].upper() or query in stock["name"].upper():
                results.append(stock)
        
        if len(results) < 5:
            try:
                ticker = yf.Ticker(query)
                info = ticker.info
                if info and info.get('symbol'):
                    results.append({
                        "symbol": info.get('symbol', query),
                        "name": info.get('longName', info.get('shortName', query)),
                        "exchange": info.get('exchange', 'Unknown')
                    })
            except:
                pass
        
        return results[:10]
    
    def get_stock_data(self, symbol, period='1mo'):
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            info = ticker.info
            
            if hist.empty:
                raise Exception(f"No data found for symbol: {symbol}")
            
            history_data = []
            for date, row in hist.iterrows():
                history_data.append({
                    "date": date.strftime('%Y-%m-%d'),
                    "open": round(row['Open'], 2),
                    "high": round(row['High'], 2),
                    "low": round(row['Low'], 2),
                    "close": round(row['Close'], 2),
                    "volume": int(row['Volume'])
                })
            
            current_price = hist['Close'].iloc[-1] if not hist.empty else 0
            prev_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
            change = current_price - prev_close
            change_percent = (change / prev_close * 100) if prev_close > 0 else 0
            
            return {
                "symbol": symbol,
                "name": info.get('longName', info.get('shortName', symbol)),
                "currentPrice": round(current_price, 2),
                "previousClose": round(prev_close, 2),
                "change": round(change, 2),
                "changePercent": round(change_percent, 2),
                "currency": info.get('currency', 'USD'),
                "exchange": info.get('exchange', 'Unknown'),
                "marketCap": info.get('marketCap', 0),
                "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh', 0),
                "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow', 0),
                "history": history_data
            }
        except Exception as e:
            raise Exception(f"Error fetching stock data: {str(e)}")
    
    def get_live_price(self, symbol):
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period='1d', interval='1m')
            
            if hist.empty:
                hist = ticker.history(period='5d')
            
            if hist.empty:
                raise Exception(f"No live data available for {symbol}")
            
            current_price = hist['Close'].iloc[-1]
            open_price = hist['Open'].iloc[0]
            high_price = hist['High'].max()
            low_price = hist['Low'].min()
            volume = int(hist['Volume'].sum())
            
            prev_close = info.get('previousClose', open_price)
            change = current_price - prev_close
            change_percent = (change / prev_close * 100) if prev_close > 0 else 0
            
            return {
                "symbol": symbol,
                "name": info.get('longName', info.get('shortName', symbol)),
                "price": round(current_price, 2),
                "open": round(open_price, 2),
                "high": round(high_price, 2),
                "low": round(low_price, 2),
                "volume": volume,
                "previousClose": round(prev_close, 2),
                "change": round(change, 2),
                "changePercent": round(change_percent, 2),
                "currency": info.get('currency', 'USD'),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise Exception(f"Error fetching live price: {str(e)}")
    
    def get_nse_stocks(self):
        nse_stocks = [stock for stock in self.popular_stocks if stock["exchange"] == "NSE"]
        return nse_stocks
