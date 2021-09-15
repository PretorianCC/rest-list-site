/**
 * Модель данных пользователя для авторизации.
 * @param {string} email - почтовый ящик пользователя.
 * @param {string} password - пароль пользователя.
 */

import { IsEmail, IsString } from "class-validator";

 export class UserDto {
  @IsEmail() email: string;
  @IsString() name: string;
}