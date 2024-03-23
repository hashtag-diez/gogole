import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import Books from './books.entity.js';

@Entity()
export default class JaccardNodes {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  book1!: Books

  @ManyToOne()
  book2!: Books

  @Property()
  grade!: number
}