FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for TypeScript compilation)
RUN npm ci

# Copy source code
COPY . .

# Debug: Show what files are present
RUN echo "=== Source files ==="
RUN ls -la src/
RUN echo "=== Checking if index.ts exists ==="
RUN ls -la src/index.ts || echo "index.ts not found in src/"

# Build TypeScript with verbose output
RUN echo "=== Starting TypeScript build ==="
RUN npx tsc --listFiles
RUN npm run build
RUN echo "=== TypeScript build completed ==="

# Debug: Show what was created in dist
RUN echo "=== Contents of dist folder ==="
RUN ls -la dist/ || echo "dist folder not found"
RUN echo "=== Looking for index.js ==="
RUN find . -name "index.js" -type f || echo "No index.js files found"

# Copy migrations to dist folder for Knex
RUN echo "=== Copying migrations to dist ==="
RUN cp -r src/database/migrations dist/database/ || echo "Failed to copy migrations"
RUN echo "=== Contents of dist migrations ==="
RUN ls -la dist/database/migrations/ || echo "No migrations in dist"

# Copy knexfile to dist for migrations and runtime
RUN echo "=== Copying knexfile to dist ==="
RUN cp knexfile.ts dist/ || echo "Failed to copy knexfile"

# Debug: Final check of dist structure
RUN echo "=== Final dist structure ==="
RUN find dist/ -type f -name "*.js" | head -20

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 