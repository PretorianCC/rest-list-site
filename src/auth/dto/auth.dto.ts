import { IsEmail, IsString } from 'class-validator';

/**
 * Модель данных пользователя для авторизации.
 * @param {string} email - почтовый ящик пользователя.
 * @param {string} password - пароль пользователя.
 */
 export class AuthDto {
  @IsEmail() login: string;
  @IsString() password: string;
}