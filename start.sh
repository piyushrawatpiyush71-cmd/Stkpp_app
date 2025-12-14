#!/bin/bash

# Start the backend API server on port 8000
cd backend && python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend development server on port 5000
cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
