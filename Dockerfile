# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

# installing pg
RUN yarn list --depth=0 | grep pg || yarn add pg

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 4444

# Command to run the application
CMD ["node", "dist/main"]