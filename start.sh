#!/bin/bash

# Start backend
cd /app/packages/backend
npm run start:app &

# Start restoWeb
cd /app/packages/restoWeb
npm run start &

# Start visitorWeb
cd /app/packages/visitorWeb
npm run start

# Keep the script running
tail -f /dev/null