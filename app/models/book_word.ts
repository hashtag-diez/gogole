import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BookWord extends BaseModel {
  @column()
  declare book_id: number

  @column()
  declare word: string

  @column()
  declare word_id: number

  @column()
  declare occurrence: number
}