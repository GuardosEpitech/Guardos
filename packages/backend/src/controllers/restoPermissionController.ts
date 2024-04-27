import mongoose from 'mongoose';
import {userRestoSchema} from '../models/userRestaurantInterfaces';

export async function getRestoPermissions(userId: number) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const user = await UserRestoSchema.findOne({ uid: userId });
  if (!user) {
    return false;
  }
  return user.permissions;
}

export async function addRestoPermission(userId: number,
  permissions: string[]) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const user = await UserRestoSchema.findOneAndUpdate(
    { uid: userId },
    { $addToSet: { permissions: { $each: permissions } } },
    { new: true }
  );
  if (!user) {
    return false;
  }
  return user.permissions;
}

export async function removeRestoPermissions(userId: number, permissions: string[]) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const user = await UserRestoSchema.findOneAndUpdate(
    { uid: userId },
    { $pullAll: { permissions: permissions } },
    { new: true });
  if (!user) {
    return false;
  }
  return user.permissions;
}

export async function deleteAllRestoPermissions(userId: number) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const user = await UserRestoSchema.findOneAndUpdate(
    { uid: userId },
    { $unset: { permissions: 1 } },
    { new: true });
  if (!user) {
    return false;
  }
  return user.permissions;
}
