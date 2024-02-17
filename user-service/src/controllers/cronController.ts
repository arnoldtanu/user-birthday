import { Request, Response } from 'express';
import { findBirthdayUserThisHour, updateUserLastBirthdaySentDate } from '../repositories/userRepositories';
import { createSuccessResponseObject, handleError } from '../helper/helper';
import { UserVisibleError } from '../models/ErrorModel';
import amqp from 'amqplib';
import { IUserDocument } from '../models/userModel';

const AMQP_URL = process.env.AMQP_URL || '';
const QUEUE_NAME = process.env.QUEUE_NAME || 'users';

export const queueBirthdayUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqAPIKey = req.body.APIKey;
    if (reqAPIKey !== process.env.API_KEY) throw new UserVisibleError('Invalid API Key');
    const users = await findBirthdayUserThisHour();
    console.log(users);
    if (users.length > 0) sendToMessageBroker(users);
    res.json(createSuccessResponseObject({ message: "Birthday user has been queued to message broker" }));
  } catch (error) {
    handleError(error, res);
  }
};

const sendToMessageBroker = async (users:IUserDocument[]) => {
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  users.forEach((user) => {
    const data = {
      fullname: user.fullname,
      email: user.email,
      type: 'bday',
    };
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), { persistent: true });
    updateUserLastBirthdaySentDate(user._id.toString());
  });
};