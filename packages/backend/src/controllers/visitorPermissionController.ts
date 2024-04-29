import mongoose from 'mongoose';
import { userSchema } from '../models/userInterface';

export async function getVisitorPermissions(userId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const user = await UserSchema.findOne({ uid: userId });
  if (!user) {
    return false;
  }
  return user.permissions;
}

export async function addVisitorPermission(userId: number,
  permissions: string[]) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const user = await UserSchema.findOneAndUpdate(
    { uid: userId },
    { $addToSet: { permissions: { $each: permissions } } },
    { new: true }
  );
  if (!user) {
    return false;
  }
  return user.permissions;
}

export async function removePermissions(userId: number, permissions: string[]) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const user = await UserSchema.findOneAndUpdate(
    { uid: userId },
    { $pullAll: { permissions: permissions } },
    { new: true });
  if (!user) {
    return false;
  }
  return user.permissions;
}

export async function deleteAllPermissions(userId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const user = await UserSchema.findOneAndUpdate(
    { uid: userId },
    { $unset: { permissions: 1 } },
    { new: true });
  if (!user) {
    return false;
  }
  return user.permissions;
}
