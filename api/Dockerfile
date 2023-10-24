FROM node

# Set the working directory within docker image
WORKDIR /api

COPY package*.json ./

RUN npm install

COPY ./ ./


EXPOSE 5000

CMD ["npm", "start"]