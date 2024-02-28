import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'

export default class User {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare author: string

  @column()
  declare title: string
  
  @column()
  declare contributors: string[]

  @column()
  declare editor: string

  @column()
  declare language: string

  @column()
  declare filepath: string

  @column()
  declare imagelink: string
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}