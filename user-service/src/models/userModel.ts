import { Schema, Document, connection } from 'mongoose';

export interface IUser {
  fullname: string;
  email: string;
  birthday: Date;
  timezone: string;
  localBirthday: Date;
  lastBirthdayMessageSent?: Date;
}

export interface IUserDocument extends IUser, Document {
}

const userSchema = new Schema<IUserDocument>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  timezone: { type: String, required: true },
  localBirthday: { type: Date, required: true },
  lastBirthdayMessageSent: { type: Date },
});

userSchema.index({ localBirthday: 1 });

export default connection.model<IUserDocument>('User', userSchema);