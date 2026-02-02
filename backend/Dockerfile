# 1. Node.js ka image use karein (Lighter version is better)
FROM node:18-alpine

# 2. Container ke andar folder create karein
WORKDIR /app

# 3. Pehle package files copy karein
COPY package*.json ./

# 4. Dependencies install karein
RUN npm install

# 5. Pura code copy karein
COPY . .

# 6. TSX install karein (Modern, fast aur hassle-free)
RUN npm install -g tsx

# 7. Backend port open karein
EXPOSE 5000

# 8. Server start karne ki command (Bina kisi loader ke)
CMD ["tsx", "server.ts"]