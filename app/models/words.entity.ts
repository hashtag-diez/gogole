import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export default class Words {
  @PrimaryKey()
  declare id: number

  @Property()
  declare word: string
}