import { EntitySchemaColumnOptions } from "typeorm";

/**
 * Общие реквизиты для всех таблиц.
 * @param id - идентификатор.
 * @param created_at - дата и время регистрации.
 * @param updated_at - дата и время обновления записи.
 */

export const BaseColumnSchema = {
  id: {
    type: Number,
    primary: true,
    generated: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: 'created_at',
    type: 'timestamp',
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updated_at',
    type: 'timestamp',
    updateDate: true,
  } as EntitySchemaColumnOptions,
};
