import express from 'express';
import userRouter from './routes/userRoutes';
// import routes from './routes/Routes';

const app = express();

app.use(express.json());
app.use('/v1/user', userRouter);

export default app;