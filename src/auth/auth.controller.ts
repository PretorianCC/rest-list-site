import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Query, Render, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR, PASSWORD_MATCH_ERROR, TOKEN_NOT_FOUND_ERROR } from './auth.constants';
// import { JwtAuthGuard } from './guards/jvt.guard';
import { AuthRestoreDto } from './dto/auth.restore.dto';
import { AuthTokenDto } from './dto/auth.tokem.dto';
import { User } from 'src/user/user.entity';
import { AuthChangeDto } from './dto/auth.change';
import { Auth } from './auth.entity';

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
  async register(@Body() dto: AuthDto): Promise<Auth> {
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
  async login(@Body() {login, password}: AuthDto): Promise<{access_token: string}> {
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
   async pageRestore(@Query() dto: AuthTokenDto): Promise<{token: string}> {
    return { token: dto.token };
   }

   /**
    * Смена пароля.
    */
   @UsePipes(new ValidationPipe())
   @HttpCode(201)
   @Post('change')
   async change(@Body() dto: AuthChangeDto): Promise<Auth> {
     if (!dto.token) {
      throw new BadRequestException(TOKEN_NOT_FOUND_ERROR);
     }
     if (dto.password !== dto.passwordOld) {
       throw new BadRequestException(PASSWORD_MATCH_ERROR);
     }
     return this.authService.changePassword(dto);
   }
}
