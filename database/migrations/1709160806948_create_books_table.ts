import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('books', (table) => {
      table.integer('id').notNullable().unique()
      table.json('author').notNullable()
      table.string('title').notNullable()
      table.json("subjects").notNullable()
      table.string('imagepath').notNullable()
      table.string('filepath').notNullable()
    })

    this.schema.createTable("book_word_occ", (table) => {
      table.string('keyword').notNullable()
      table.integer('book_id').references('id').inTable('books')
      table.integer('occurrence').notNullable()
    })
  }

  async down() {}
}
