import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
// import { JwtAuthGuard } from './guards/jvt.guard';
import { AuthRestoreDto } from './dto/auth.restore.dto';
import { AuthTokenDto } from './dto/auth.tokem.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрация аккаунта.
   * @param dto данные авторизации.
   * @returns объект авторизации.
   */
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findAuth(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createAuth(dto);
  }

  /**
   * Авторизация аккаунта.
   * @param param0 данные авторизации.
   * @returns - токен
   */
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() {login, password}: AuthDto) {
    const {email} = await this.authService.validateAuth(login, password);
    return this.authService.login(email);
  }

  /**
   * Подтверждение почтового ящика аккаунта.
   * @param token токен подтверждение почты.
   * @returns 
   */
  @UsePipes(new ValidationPipe())
  @Get('confirm')
  async confirm(@Query() dto: AuthTokenDto) {
    return this.authService.confirmation(dto);
  }

  /**
   * Получение токена на востановление пароля.
   * @param param0 данные востановления пароля.
   * @returns 
   */
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('restore')
  async restore(@Body() {login}: AuthRestoreDto): Promise<void> {
    return this.authService.restorePassword(login);
  }
}
