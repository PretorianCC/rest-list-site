/**
 * Таблица авторизации.
 * @param email - почтовый ящик аккаунта.
 * @param passwordHash - хеш пароля аккаунта.
 * @param uuid - идентификатор для проверок и востановления.
 * @param created_at - дата и время регистрации.
 * @param updated_at - дата и время обновления записи.
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {

  @PrimaryGeneratedColumn() id: number;
  @Column({ type: "varchar", length: 60, unique: true}) email: string;
  @Column({ type: "varchar", length: 60}) passwordHash: string;
  @Column({ type: "varchar", length: 36}) uuid: string;
  @Column({ type: "timestamp", update: false}) created_at: Date;
  @Column({ type: "timestamp", update: true}) updated_at: Date;
}
