import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(user: Partial<User>): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      throw new ConflictException('Email ya existe');
    }
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: ids } }).exec();
  }
}
