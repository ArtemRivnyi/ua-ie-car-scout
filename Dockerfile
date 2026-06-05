FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root user to install dependencies if needed, but puppeteer image comes with everything
USER root

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Start the server
CMD ["npm", "run", "server"]
