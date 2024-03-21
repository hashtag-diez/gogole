import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare author: string

  @column()
  declare title: string

  @column()
  declare filepath: string

  @column()
  declare subjects: string

  @column()
  declare imagepath: string

  @column()
  declare dbId: number

  @column()
  declare bc: number

  @column()
  declare suggestions: JSON
}