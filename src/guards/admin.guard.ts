import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User in AdminGuard:', user); // Log để debug
    if (user && user.admin) {
      return true;
    }

    console.log('AdminGuard failed: User is not an admin');
    throw new HttpException('Forbidden: Admin access required', HttpStatus.FORBIDDEN);
  }
}