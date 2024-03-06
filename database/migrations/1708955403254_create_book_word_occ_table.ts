import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable("book_words", (table) => {
      table.string('word').notNullable()
      table.integer('book_id').references('id').inTable('books')
      table.integer('occurrence').notNullable()
    })
  }

  async down() {}
}
