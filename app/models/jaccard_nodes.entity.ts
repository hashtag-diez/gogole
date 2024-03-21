import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export default class JaccardNode {
  @PrimaryKey()
  id!: number;

  @Property()
  book_id_1!: number

  @Property()
  book_id_2!: number

  @Property()
  grade!: number
}