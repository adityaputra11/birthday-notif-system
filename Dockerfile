# Gunakan Node.js sebagai base image
FROM node:18

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./

# Install dependencies menggunakan Yarn
RUN yarn install --frozen-lockfile

# Copy semua file ke dalam container
COPY . .

# Build aplikasi (jika menggunakan TypeScript)
RUN yarn build

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["yarn", "start:prod"]