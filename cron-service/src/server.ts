import axios from 'axios';
import cron from 'node-cron';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || '';
const API_KEY = process.env.API_KEY || '';

async function fetchData() {
  try {
    console.log(USER_SERVICE_URL);
    const response = await axios.post(USER_SERVICE_URL, {
      APIKey: API_KEY,
    });
    console.log("response.status", response.status);
  } catch (error) {
    console.log(error);
  }
}

const cronSchedule = '*/30 * * * *';

const task = async () => {
  console.log('Cron job executed at:', new Date());
  await fetchData();
};

const cronJob = cron.schedule(cronSchedule, task);
cronJob.start();
console.log('started at:', new Date());

// const a = async () => {
//   await fetchData();
// };
// a();