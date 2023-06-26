#!/bin/bash

# Start backend
cd /app/packages/backend
npm run start:app &

# Start visitorWeb
cd /app/packages/visitorWeb
npm run start

# Keep the script running
tail -f /dev/null