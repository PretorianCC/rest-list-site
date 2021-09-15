import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Query, Render, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR, USER_CONFIRMED_ERROR } from './auth.constants';
// import { JwtAuthGuard } from './guards/jvt.guard';
import { AuthRestoreDto } from './dto/auth.restore.dto';
import { AuthTokenDto } from './dto/auth.tokem.dto';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * Регистрация аккаунта.
   * @param dto данные авторизации.
   * @returns объект авторизации.
   */
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldAuth = await this.authService.findAuth(dto.login);
    if (oldAuth) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    const auth = await this.authService.createAuth(dto);
    this.authService.sendConfirmationEmail(dto.login);
    return auth;
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
  async confirm(@Query() dto: AuthTokenDto): Promise<User> {
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

  /**
   * Страница изменения пароля.
   */
   @UsePipes(new ValidationPipe())
   @HttpCode(200)
   @Get('restore')
   @Render('restorePassword')
   async pageRestore(@Query() dto: AuthTokenDto) {
    return { token: dto.token };
   }
}
