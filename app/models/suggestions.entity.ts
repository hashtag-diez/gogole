import { Entity, PrimaryKey, OneToOne, ManyToMany, Collection } from '@mikro-orm/core';
import Books from './books.entity.js';

@Entity()
export default class Suggestions {
  @PrimaryKey({ autoincrement: true })
  declare id: number

  @OneToOne()
  book!: Books;

  @ManyToMany(() => Books)
  similar: Collection<Books> = new Collection<Books>(this);
}