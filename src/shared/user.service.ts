import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { LoginDTO, RegisterDTO, UpdateUserDTO } from '../auth/auth.dto';
import { Payload } from '../types/payload';
import { User } from '../types/user';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userDTO: RegisterDTO) {
    const { username } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async find() {
    return await this.userModel.find();
  }

  async findByLogin(userDTO: LoginDTO) {
    const { username, password } = userDTO;
    const user = await this.userModel
      .findOne({ username })
      .select('username password seller created address admin');
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: Payload) {
    const { username } = payload;
    return await this.userModel.findOne({ username });
  }

  sanitizeUser(user: User) {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async update(userId: string, userDTO: UpdateUserDTO): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    if (userDTO.password) {
      userDTO.password = await bcrypt.hash(userDTO.password, 10);
    }
  
    await user.updateOne(userDTO);
    return await this.userModel.findById(userId).select('-password');
  }

  async findAll() {
    return await this.userModel.find().select('-password');
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  
}