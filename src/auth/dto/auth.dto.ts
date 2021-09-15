/**
 * Модель данных пользователя для авторизации.
 * @param login - почтовый ящик пользователя.
 * @param password - пароль пользователя.
 */

import { IsEmail, IsString } from 'class-validator';

 export class AuthDto {
  @IsEmail() login: string;
  @IsString() password: string;
}