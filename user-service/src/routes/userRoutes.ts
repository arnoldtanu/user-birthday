import { Router } from 'express';
import { getUsersController, createUserController, updateUserController, deleteUserController } from '../controllers/userController';

const userRouter = Router();

userRouter.get('/:userid', getUsersController);
userRouter.post('/', createUserController);
userRouter.put('/', updateUserController);
userRouter.delete('/', deleteUserController);

export default userRouter;