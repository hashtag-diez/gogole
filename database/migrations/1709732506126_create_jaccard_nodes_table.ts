import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jaccard_nodes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('book_id_1').references('id').inTable('books')
      table.integer('book_id_2').references('id').inTable('books')
      table.integer('grade').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}