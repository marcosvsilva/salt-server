FROM registry.access.redhat.com/ubi8/nodejs-16:latest

EXPOSE 8080
ENV PORT 8080

COPY package*.json ./
RUN  npm install --legacy-peer-deps
COPY . .

RUN npm run build

ENTRYPOINT ["node", "./app.js"]
