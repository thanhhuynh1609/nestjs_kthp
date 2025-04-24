import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO } from '../auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload: Payload = {
      username: user.username,
      seller: user.seller || false,
      admin: user.admin || false,
    };
    const accessToken = await this.signPayload(payload);
    return { access_token: accessToken, user };
  }
}