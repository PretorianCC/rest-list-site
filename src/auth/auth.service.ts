import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Auth } from './auth.entity';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4} from 'uuid';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth) private readonly userRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  /**
   * Создать пользователя.
   * @param dto модель авторизации.
   * @returns созданный пользователь.
   */
  async createUser(dto: AuthDto): Promise<Auth> {
    const salt = await genSalt(10);
    const newUser = new Auth();
    newUser.email = dto.login;
    newUser.passwordHash = await hash(dto.password, salt);
    return this.userRepository.save(newUser);  
  }

  /**
   * Найти пользователя.
   * @param email почтовый адрес пользователя.
   * @returns найденый пользователь
   */
  async findUser(email: string): Promise<Auth> {
    return this.userRepository.findOne({email});
  }

  /**
   * Авторизирует пользователя.
   * @param email почтовый адрес пользователя.
   * @param password пароль пользователя.
   * @returns почтовый адрес пользователя.
   */
  async validateUser(email: string, password: string): Promise<Pick<Auth, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return {email: user.email}
  }

  /**
   * Возвращает новый jwt токен.
   * @param email почтовый адрес пользователя.
   * @returns jwt токен.
   */
  async login(email: string) {
    const payload = {email};
    return {
      access_token: await this.jwtService.sign(payload)
    }
  }

  /**
   * Идентификатор для смены пароля.
   * @param email почтовый адрес пользователя.
   * @returns
   */
  async restorePassword(email: string): Promise<void> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const token = uuidv4();
    user.restorePasswordId = token;
    this.userRepository.save(user);
    this.mailService.sendAuthConfirmation(email, token);
  }
}
