import express from 'express';
import userRouter from './routes/userRoutes';
import cronRouter from './routes/cronRoutes';

const app = express();

app.use(express.json());
app.use('/v1/user', userRouter);
app.use('/v1/cron', cronRouter);

export default app;