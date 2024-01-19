FROM node:21

WORKDIR /app

# Install dependencies
COPY ./package.json ./
RUN npm install

COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]