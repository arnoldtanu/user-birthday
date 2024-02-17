import { addYearToLocalBirthday } from '../helper/helper';
import User, { IUser } from '../models/userModel';

export const findUserById = async (userId: string) : Promise<IUser|null> => {
  return await User.findById(userId);
};

export const registerNewUser = async (data:IUser) => {
  const newUser = new User(data);
  return await newUser.save();
};

export const updateUserData = async (userId:string, data:IUser) => {
  return await User.findOneAndUpdate({ _id: userId }, data, { new: true });
};

export const deleteUser = async (userId:string) => {
  return await User.findOneAndDelete({ _id: userId });
};

export const findBirthdayUserThisHour = async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const oneHourFromNow = new Date(Date.now() + 1 * 60 * 60 * 1000);
  return User.find({
    localBirthday: {
      $gte: yesterday,
      $lte: oneHourFromNow,
    },
    $or: [
      { lastBirthdayMessageSent: { $lt: yesterday } },
      { lastBirthdayMessageSent: { $exists: false } },
    ],
  });
};

export const updateUserLastBirthdaySentDate = async (userId:string) => {
  console.log(userId);
  const userData = await findUserById(userId);
  if (userData !== null) {
    userData.lastBirthdayMessageSent = new Date();
    userData.localBirthday = addYearToLocalBirthday(userData.localBirthday);
    return await User.findOneAndUpdate({ _id: userId }, userData, { new: true });
  }
};