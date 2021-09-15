import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Auth } from './auth.entity';
import { genSalt, hash, compare } from 'bcryptjs';
import { TOKEN_NOT_FOUND_ERROR, USER_CONFIRMED_ERROR, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4} from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { AuthTokenDto } from './dto/auth.tokem.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService
  ) {}

  /**
   * Создать аккаунт.
   * @param dto модель авторизации.
   * @returns созданный аккаунт.
   */
  async createAuth(dto: AuthDto): Promise<Auth> {
    const salt = await genSalt(10);
    const newAuth = new Auth();
    newAuth.email = dto.login;
    newAuth.passwordHash = await hash(dto.password, salt);
    return this.authRepository.save(newAuth);
  }

  /**
   * Найти аккаунт.
   * @param email почтовый адрес пользователя.
   * @returns найденый аккаунт
   */
  async findAuth(email: string): Promise<Auth> {
    return this.authRepository.findOne({email});
  }

  /**
   * Проверяет авторизацию аккаунта.
   * @param email почтовый адрес пользователя.
   * @param password пароль пользователя.
   * @returns почтовый адрес пользователя.
   */
  async validateAuth(email: string, password: string): Promise<Pick<Auth, 'email'>> {
    const auth = await this.findAuth(email);
    if (!auth) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, auth.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return {email: auth.email}
  }

  /**
   * Возвращает новый jwt токен.
   * @param email почтовый адрес пользователя.
   * @returns jwt токен.
   */
  async login(email: string): Promise<{access_token: string}> {
    const payload = {email};
    return {
      access_token: await this.jwtService.sign(payload)
    }
  }

  /**
   * Отправка письма аккаунта с идентификатором для смены пароля.
   * @param email почтовый адрес пользователя.
   */
  async restorePassword(email: string): Promise<void> {
    const token = await this.createTokenAuth(email);
    this.mailService.sendRestorePassword(email, token);
  }

  /**
   * Отправка письма, для подтверждения адреса электронной почты аккаунта.
   * @param email почтовый адрес пользователя.
   */
  async sendConfirmationEmail(email: string): Promise<void> {
    const token = await this.createTokenAuth(email);
    this.mailService.sendAuthConfirmation(email, token);
  }

  /**
   * Создать токен аккаунту.
   * @param email почтовый адрес пользователя.
   * @returns созданный токен.
   */
  async createTokenAuth(email: string): Promise<string> {
    const auth = await this.findAuth(email);
    if (!auth) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const token = uuidv4();
    auth.uuid = token;
    await this.authRepository.save(auth);
    return token;
  }

  /**
   * Подтверждение электронной почты аккаунта и создание пользователя.
   * @param dto модель токена.
   * @returns созданный пользователь.
   */
  async confirmation(dto: AuthTokenDto): Promise<User> {
    const auth = await this.findToken(dto.token);
    if (!auth) {
      throw new UnauthorizedException(TOKEN_NOT_FOUND_ERROR);
    }
    auth.uuid = "";
    this.authRepository.save(auth);
    const user = await this.userService.findUser(auth.email);
    if (user) {
       throw new UnauthorizedException(USER_CONFIRMED_ERROR);
    }
    return this.userService.createUser({email: auth.email, name: auth.email});
  }

    /**
   * Найти аккаунт по токену.
   * @param token токен акаунта.
   * @returns найденный аккаунт авторизации.
   */
     async findToken(token: string): Promise<Auth> {
      return await this.authRepository.findOne({uuid: token});
    }
  
}
