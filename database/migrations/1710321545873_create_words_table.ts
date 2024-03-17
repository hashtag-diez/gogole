import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('words', (table) => {
      table.increments('id')
      table.string('word').notNullable()
    })

    this.schema.alterTable('book_words', (table) => {
      table.integer('word_id')
    })
  }

  async down() {

  }
}