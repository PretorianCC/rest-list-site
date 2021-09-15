/**
 * Таблица пользователей.
 * @param id - идентификатор записи.
 * @param email - почтовый ящик пользователя.
 * @param name - имя пользователя.
 * @param created_at - дата и время регистрации.
 * @param updated_at - дата и время обновления записи.
 */

 import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: "varchar", length: 60, nullable: false, unique: true}) email: string;
  @Column({ type: "varchar", length: 100, nullable: false}) name: string;
  @Column({ type: "timestamp", update: false}) created_at: Date;
  @Column({ type: "timestamp", update: false}) updated_at: Date;
}
