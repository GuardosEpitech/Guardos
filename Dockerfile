# Use a base image with Node.js pre-installed
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy package.json file
COPY package.json /app/

# Copy lerna.json file
COPY lerna.json /app/

# Install lerna globally
RUN npm install -g lerna

# Copy the packages folder
COPY packages /app/packages

# Set the working directory to /app/packages/shared
WORKDIR /app/packages/shared

# Install dependencies shared
RUN npm install

# Set the working directory to /app/packages/backend
WORKDIR /app/packages/backend

# Install dependencies backend
RUN npm install

# Set the working directory to /app/packages/restoWeb
WORKDIR /app/packages/restoWeb

# Install dependencies restoWeb
RUN npm install

# Set the working directory to /app/packages/visitorWeb
WORKDIR /app/packages/visitorWeb

# Install dependencies visitorWeb
RUN npm install

# Expose ports 8080, 8081, and 8082
EXPOSE 8080 8081 8082

# Run multiple commands using a shell script
COPY start.sh /app/
RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]
