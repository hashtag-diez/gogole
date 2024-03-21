import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class JaccardNode extends BaseModel {
  @column()
  declare book_id_1: number

  @column()
  declare book_id_2: number

  @column()
  declare grade: number
}