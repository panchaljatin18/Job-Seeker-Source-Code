import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel({
      ...userData,
      email: userData.email.toLowerCase().trim(),
    });
    return newUser.save();
  }

  async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async markEmailVerified(email: string): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { isEmailVerified: true },
      { new: true },
    ).exec();
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.userModel.updateOne(
      { email: email.toLowerCase().trim() },
      { lastLoginAt: new Date() },
    ).exec();
  }
}

