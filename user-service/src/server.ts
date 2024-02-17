import app from './app';
import { connectDB } from './configs/db';
import { findBirthdayUserThisHour } from './repositories/userRepositories';

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, async () => {
      console.log(new Date(), `- Server is running on port ${PORT} ========================================================================================`);
      console.log(await findBirthdayUserThisHour());
    });
  });