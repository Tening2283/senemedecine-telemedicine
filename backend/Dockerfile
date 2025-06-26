FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for TypeScript compilation)
RUN npm ci

# Copy source code
COPY . .

# Debug: Show what files are present
RUN ls -la src/
RUN echo "=== Checking if index.ts exists ==="
RUN ls -la src/index.ts || echo "index.ts not found in src/"

# Build TypeScript with verbose output
RUN echo "=== Starting TypeScript build ==="
RUN npm run build
RUN echo "=== TypeScript build completed ==="

# Debug: Show what was created in dist
RUN echo "=== Contents of dist folder ==="
RUN ls -la dist/ || echo "dist folder not found"
RUN echo "=== Looking for index.js ==="
RUN find . -name "index.js" -type f || echo "No index.js files found"
RUN echo "=== All JS files in project ==="
RUN find . -name "*.js" -type f || echo "No JS files found"

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Debug: Check if dist/index.js still exists after pruning
RUN echo "=== After pruning - checking dist/index.js ==="
RUN ls -la dist/index.js || echo "dist/index.js not found after pruning"

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 