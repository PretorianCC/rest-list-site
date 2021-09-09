import { IsUUID } from 'class-validator';

/**
 * Модель данных подтверждения регистрации или смены пароля.
 * @param {string} token - токен подтверждения.
 */
 export class AuthTokenDto {
  @IsUUID(4) token: string;
}