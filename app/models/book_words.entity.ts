import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import type { Ref } from '@mikro-orm/core';
import Books from './books.entity.js';
import Words from './words.entity.js';

@Entity()
export default class BookWords  {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  book!: Books

  @Property()
  word!: string

  @ManyToOne(() => Words, {nullable: true})
  words?: Ref<Words>

  @Property()
  occurrence!: number
}