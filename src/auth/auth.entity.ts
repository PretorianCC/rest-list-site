/**
 * Модель пользователя для авторизации.
 * @param {string} email - почтовый ящик пользователя.
 * @param {string} passwordHash - хеш пароля пользователя.
 */

import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {

  @PrimaryGeneratedColumn() id: number;
  @Column({ type: "varchar", length: 60, unique: true}) email: string;
  @Column({ type: "varchar", length: 60}) passwordHash: string;
  @Column({ type: "varchar", length: 36}) restorePasswordId: string;
  @Column({ type: "timestamp", update: false}) created_at: Date;
  @Column({ type: "timestamp", update: true}) updated_at: Date;
}
