import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export default class Books  {
  @PrimaryKey()
  id!: number

  @Property()
  author!: string

  @Property()
  title!: string

  @Property()
  filepath!: string

  @Property()
  subjects!: string

  @Property()
  imagepath!: string

  @Property()
  dbId!: number

  @Property()
  bc!: number

  @Property()
  suggestions!: JSON
}