import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique()
      table.string('author').notNullable()
      table.string('title').notNullable()
      table.string('contributors').notNullable()
      table.string('editor').notNullable()
      table.string('language').notNullable()
      table.string('filepath').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}