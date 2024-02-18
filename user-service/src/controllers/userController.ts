import { Request, Response } from 'express';
import { IUser } from '../models/userModel';
import { UserVisibleError } from '../models/ErrorModel';
import moment from 'moment-timezone';
import { deleteUser, findUserById, registerNewUser, updateUserData } from '../repositories/userRepositories';
import { addYearToLocalBirthday, createSuccessResponseObject, handleError } from '../helper/helper';

export const getUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userid;
    const users = await findUserById(userId);
    res.json(createSuccessResponseObject(users));
  } catch (error) {
    handleError(error, res);
  }
};

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqData = createUserDataObject(req);
    const newUser = await registerNewUser(reqData);
    res.status(201).json(createSuccessResponseObject(newUser));
  } catch (error) {
    handleError(error, res);
  }
};

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserIdFromRequest(req);
    const userData = createUserDataObject(req);
    const users = await updateUserData(userId, userData);
    res.status(201).json(createSuccessResponseObject(users));
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserIdFromRequest(req);
    const users = await deleteUser(userId);
    if (users === null) throw new UserVisibleError('userId not found');
    res.status(201).json(createSuccessResponseObject({ message: 'User has been deleted', data: users }));
  } catch (error) {
    handleError(error, res);
  }
};

function createUserDataObject(req:Request) {
  const rightNow = new Date();
  if (!moment.tz.zone(req.body.timezone)) throw new UserVisibleError('Timezone not valid', 400);
  if (!moment(req.body.birthday, 'YYY-MM-DD', true).isValid()) throw new UserVisibleError('Birthday Date format not valid, must be in YYYY-MM-DD');
  const reqData : IUser = {
    fullname: req.body.fullname,
    email: req.body.email,
    birthday: new Date(req.body.birthday),
    timezone: req.body.timezone,
    localBirthday: new Date(moment.tz(req.body.birthday + " 09:00:00", req.body.timezone).tz('UTC').toDate().setFullYear(rightNow.getFullYear())),
  };

  const isBirthdayPassedThisYear = Boolean(reqData.localBirthday.getTime() <= rightNow.getTime());
  if (isBirthdayPassedThisYear) {
    reqData.localBirthday = addYearToLocalBirthday(reqData.localBirthday);
  }
  return reqData;
}

function getUserIdFromRequest(req:Request) {
  const userId = req.body.userId;
  if (typeof userId === 'undefined') throw new UserVisibleError('user id is required', 400);
  return userId;
}
