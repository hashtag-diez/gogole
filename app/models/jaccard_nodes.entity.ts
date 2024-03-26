import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import Books from './books.entity.js';

@Entity()
export default class JaccardNodes {
  @PrimaryKey()
  id!: number;

  @Property()
  book_id_1!: number

  @Property()
  book_id_2!: number

  @Property()
  grade!: number
}