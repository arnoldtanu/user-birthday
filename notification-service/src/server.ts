import amqp from 'amqplib';
import axios from 'axios';

interface IUser {
  fullname: string;
  email: string;
  type: string;
}

const AMQP_URL = process.env.AMQP_URL || '';
const QUEUE_NAME = process.env.QUEUE_NAME || 'users';

const subscribeFromMessageBroker = async () => {
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg) {
      const dataJSON = msg?.content.toString();
      const data : IUser = dataJSON ? JSON.parse(dataJSON) : {};
      console.log("data from rabbitMQ", data);
      const result = await fetchData(data);
      console.log("result", result);
      if (result) channel.ack(msg);
    }
  }, { noAck: false });
};
subscribeFromMessageBroker();

async function fetchData(user:IUser): Promise<boolean> {
  try {
    const response = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
      email: user.email,
      message: `Hi, ${user.fullname}! It's Your birthday today!!`,
    });
    console.log("response.status", response.status);
    if (response.status === 200) return true;
    return false;
  } catch (error) {
    return false;
  }
}
