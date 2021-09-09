import { EntitySchema } from "typeorm";
import { BaseColumnSchema } from "src/schemas/base.column.entity";

/**
 * Таблица пользователей.
 * @param email - почтовый ящик пользователя.
 * @param name - имя пользователя.
 */

export const User = new EntitySchema({
  name: "users",
  columns: {
    ...BaseColumnSchema,
    email: {
      type: String,
      length: 60,
      nullable: false
    },
    name: {
        type: String,
        length: 100,
        nullable: false
    }
  }
});