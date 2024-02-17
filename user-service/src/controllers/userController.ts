import { Request, Response } from 'express';
import { IUser } from '../models/userModel';
import { UserVisibleError } from '../models/ErrorModel';
import moment from 'moment-timezone';
import { deleteUser, findUserById, registerNewUser, updateUserData } from '../repositories/userRepositories';

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
  const reqData : IUser = {
    fullname: req.body.fullname,
    email: req.body.email,
    birthday: new Date(req.body.birthday),
    timezone: req.body.timezone,
    localBirthday: new Date(moment.tz(req.body.birthday, req.body.timezone).tz('UTC').toDate().setFullYear(rightNow.getFullYear())),
  };

  const isBirthdayPassedThisYear = Boolean(reqData.localBirthday.getTime() <= rightNow.getTime());
  if (isBirthdayPassedThisYear) {
    reqData.localBirthday = new Date(reqData.localBirthday.setFullYear(rightNow.getFullYear() + 1));
  }
  if (!moment.tz.zone(reqData.timezone)) throw new UserVisibleError('Timezone not valid', 400);
  if (!moment(req.body.birthday, 'YYY-MM-DD', true).isValid()) throw new UserVisibleError('Birthday Date format not valid, must be in YYYY-MM-DD');
  return reqData;
}

function getUserIdFromRequest(req:Request) {
  const userId = req.body.userId;
  if (typeof userId === 'undefined') throw new UserVisibleError('user id is required', 400);
  return userId;
}

/**
 * function that will handle if there are some errors that occur
 * @param error error object when there is a problem
 * @param res response object
 */
function handleError(error: any, res:Response) : void {
  console.error(error);
  let errorCode = 500;
  if (error instanceof UserVisibleError) {
    if (error.errorCode !== null) errorCode = error.errorCode;
    else errorCode = 400;
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    errorCode = 400;
    error.message = "user's email already registered.";
  }
  res.status(errorCode).json(createErrorResponseObject(error, errorCode));
}

/**
 * create an object structure that will be passed as response data
 * @param data data to return as response
 * @returns response data
 */
function createSuccessResponseObject(data:any) {
  return {
    success: true,
    data: data,
  };
}

/**
 * create an object structure that will be passed as response data when an error occurs
 * @param error error object when there is a problem
 * @param errorCode http error code that will be returned as response
 * @returns response data
 */
function createErrorResponseObject(error: Error, errorCode: number) {
  return {
    success: false,
    error: {
      code: errorCode,
      message: error.message,
    },
  };
}