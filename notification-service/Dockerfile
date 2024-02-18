FROM node:19-alpine
WORKDIR /app 
COPY package*.json ./ 
RUN npm install 
COPY . . 
#ENTRYPOINT npm test && npm start
#ENTRYPOINT npm run watch-server
CMD ["npm", "run", "watch-server"]