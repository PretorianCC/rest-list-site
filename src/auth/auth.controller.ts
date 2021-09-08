import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
// import { JwtAuthGuard } from './guards/jvt.guard';
import { AuthRestoreDto } from './dto/auth.restore.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly userService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.userService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.userService.createUser(dto);
  }

  // @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() {login, password}: AuthDto) {
    const {email} = await this.userService.validateUser(login, password);
    return this.userService.login(email);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('restore')
  async restore(@Body() {login}: AuthRestoreDto) {
    return this.userService.restorePassword(login);
  }
}
