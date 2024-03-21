import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export default class BookWord  {
  @PrimaryKey()
  id!: number;

  @Property()
  book_id!: number

  @Property()
  word!: string

  @Property()
  word_id!: number

  @Property()
  occurrence!: number
}