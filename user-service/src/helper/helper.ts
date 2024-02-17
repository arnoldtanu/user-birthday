import { Response } from 'express';
import { UserVisibleError } from '../models/ErrorModel';

export function addYearToLocalBirthday(localBirthday:Date, numberOfYear = 1) {
  const rightNow = new Date();
  return localBirthday = new Date(localBirthday.setFullYear(rightNow.getFullYear() + numberOfYear));
}

/**
 * function that will handle if there are some errors that occur
 * @param error error object when there is a problem
 * @param res response object
 */
export function handleError(error: any, res:Response) : void {
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
export function createSuccessResponseObject(data:any) {
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