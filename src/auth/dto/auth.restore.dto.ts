import { IsEmail } from 'class-validator';

/**
 * Модель данных востановления пароля пользователя для авторизации.
 * @param {string} email - почтовый ящик пользователя.
 */
 export class AuthRestoreDto {
  @IsEmail() login: string;
}