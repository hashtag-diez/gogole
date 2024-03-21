import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export default class Word {
  @PrimaryKey()
  declare id: number

  @Property()
  declare word: string
}