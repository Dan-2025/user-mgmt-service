# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the application port (defined in .env or passed at runtime)
EXPOSE 5000

# Run the application with the passed environment variables
CMD ["node", "src/server.js"]