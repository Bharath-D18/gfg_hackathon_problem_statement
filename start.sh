#!/bin/bash

# Start MongoDB
brew services start mongodb-community@7.0

# Start Backend
cd backend
npm start &

# Wait for backend to start
sleep 3

# Start Frontend
cd ../frontend
python3 -m http.server 3000
