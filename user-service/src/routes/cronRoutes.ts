import { Router } from 'express';
import { queueBirthdayUsersController } from '../controllers/cronController';

const cronRouter = Router();

cronRouter.post('/', queueBirthdayUsersController);

export default cronRouter;