import User, { IUser } from '../models/userModel';

export const findUserById = async (userId: string) => {
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
  console.log("yesterday:", yesterday, "1hours:", oneHourFromNow);
  return User.find({
    localBirthday: {
      $gte: yesterday,
      $lte: oneHourFromNow,
    },
    $or: [
      { lastBirthdayMessage: { $lt: yesterday } },
      { lastBirthdayMessage: { $exists: false } },
    ],
  });
};