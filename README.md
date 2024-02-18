# user-birthday
An simple API to register user's name and birthday, and the sistem will send happy birthday message to their email at 9 am on their local time.

### Getting Started

This app can be run through docker, here is how to run it:

##### 1. Clone this project
##### 2. Download docker
- Download docker desktop from https://www.docker.com/products/docker-desktop/ and install it.

##### 3. Build and run from docker
- Enter project's root folder via terminal
- run command:

```
docker-compose up
```
- Docker compose will download and build necesary image.

##### 4. Unit test will run automatically
##### 5. Send JSON payload
- Submit JSON payload to `localhost:3000/v1/user`
- example:
```
{
  "fullname": "Arnold Tanu",
  "email": "arnold.tanuwijaya@gmail.com",
  "birthday": "1987-04-30",
  "timezone": "Asia/Jakarta"
}
```
- more detailed documentation can be accessed through: https://documenter.getpostman.com/view/2420243/2sA2r81iRu


## Build With
- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [RabbitMQ](https://rabbitmq.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)