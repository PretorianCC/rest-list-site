import { IsString, IsUUID } from "class-validator";

/**
 * Модель данных смена пароля аккаунта.
 * @param {string} token - токен подтверждения.
 * @param {string} password - новый пароль.
 * @param {string} token - повтор нового пароля.
 */
 export class AuthChangeDto {
  @IsUUID(4) token: string;
  @IsString() password: string;
  @IsString() passwordOld: string;
}