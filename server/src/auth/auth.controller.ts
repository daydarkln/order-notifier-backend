import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Эндпоинт логина. Если пользователь ввёл корректные данные – возвращается токен и флаг смены пароля.
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  // Эндпоинт смены пароля (требует авторизации)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body: { newPassword: string }) {
    return this.authService.changePassword(req.user.sub, body.newPassword);
  }
}
