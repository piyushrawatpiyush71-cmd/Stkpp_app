import pandas as pd
from datetime import datetime
import time
import requests
from io import StringIO

# ---------------- Exceptions ----------------

class RateLimitException(Exception):
    pass

# ---------------- Rate Limiter ----------------

class SimpleRateLimiter:
    def __init__(self, max_calls=5, window=60):
        self.max_calls = max_calls
        self.window = window
        self.calls = {}

    def allow(self, key):
        now = time.time()
        timestamps = self.calls.get(key, [])
        timestamps = [t for t in timestamps if now - t < self.window]

        if len(timestamps) >= self.max_calls:
            return False

        timestamps.append(now)
        self.calls[key] = timestamps
        return True

# ---------------- Cache ----------------

class SimpleCache:
    def __init__(self, ttl=300):
        self.cache = {}
        self.ttl = ttl

    def get(self, key):
        if key in self.cache:
            value, ts = self.cache[key]
            if time.time() - ts < self.ttl:
                return value
            del self.cache[key]
        return None

    def set(self, key, value):
        self.cache[key] = (value, time.time())

# ---------------- Stock Service ----------------

class StockService:
    def __init__(self):
        self.rate_limiter = SimpleRateLimiter()
        self.cache = SimpleCache()

        self.popular_stocks = [
            {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ"},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "exchange": "NASDAQ"},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "exchange": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ"},
            {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "exchange": "NSE"},
            {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "exchange": "NSE"},
            {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "exchange": "NSE"},
        ]

    # ---------- Utilities ----------

    def _convert_to_stooq_symbol(self, symbol):
        if symbol.endswith(".NS") or symbol.endswith(".BO"):
            return f"{symbol.replace('.NS','').replace('.BO','').lower()}.in"
        return f"{symbol.lower()}.us"

    # ---------- Search ----------

    def search_stocks(self, query):
        query = query.upper()
        return [
            s for s in self.popular_stocks
            if query in s["symbol"].upper() or query in s["name"].upper()
        ][:10]

    # ---------- Stooq Fetch ----------

    def fetch_from_stooq(self, symbol):
        stooq_symbol = self._convert_to_stooq_symbol(symbol)
        url = f"https://stooq.com/q/d/l/?s={stooq_symbol}&i=d"

        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            raise Exception("Stooq unavailable")

        df = pd.read_csv(StringIO(r.text))
        if df.empty:
            raise Exception("No data from Stooq")

        df = df.tail(30)

        history = []
        for _, row in df.iterrows():
            history.append({
                "date": row["Date"],
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"]) if not pd.isna(row["Volume"]) else 0
            })

        current = history[-1]["close"]
        prev = history[-2]["close"] if len(history) > 1 else current
        change = current - prev
        change_pct = (change / prev * 100) if prev else 0

        return {
            "symbol": symbol,
            "name": symbol,
            "currentPrice": round(current, 2),
            "previousClose": round(prev, 2),
            "change": round(change, 2),
            "changePercent": round(change_pct, 2),
            "currency": "USD",
            "exchange": "Unknown",
            "marketCap": 0,
            "fiftyTwoWeekHigh": 0,
            "fiftyTwoWeekLow": 0,
            "history": history
        }

    # ---------- Public APIs ----------

    def get_stock_data(self, symbol, period="1mo"):
        cache_key = f"stock_{symbol}_{period}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        if not self.rate_limiter.allow(symbol):
            raise RateLimitException("Rate limit exceeded")

        data = self.fetch_from_stooq(symbol)
        self.cache.set(cache_key, data)
        return data

    def get_live_price(self, symbol):
        data = self.fetch_from_stooq(symbol)
        return {
            "symbol": symbol,
            "price": data["currentPrice"],
            "change": data["change"],
            "changePercent": data["changePercent"],
            "timestamp": datetime.utcnow().isoformat()
        }

    def get_nse_stocks(self):
        return [s for s in self.popular_stocks if s["exchange"] == "NSE"]
