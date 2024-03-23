// import type { HttpContext } from '@adonisjs/core/http'

import Books from '#models/books.entity'
import { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/db'
import BookWord from '#models/book_words.entity'
import { QueryOrder } from '@mikro-orm/sqlite'

export default class BooksController {

  async index({ request }: HttpContext) {
    const index = request.input('page', 1)
    const books = await db.em.findAndCount(Books, {}, { limit: 10, offset: (index - 1) * 50 })
    return books
  }

  async search({ request }: HttpContext) {
    const reg: string = request.input('query', '')
    const qb = db.em.getConnection()
    const res = await qb.execute(`
        SELECT b.*
        FROM books b
        JOIN book_words bw ON b.id = bw.book_id
        WHERE bw.word regexp '${reg.toLowerCase()}'
        ORDER BY b.bc DESC
        LIMIT 10;
    `)
    /*     const qb = db.em.createQueryBuilder(BookWord, "bw")
    const res = qb
    .select(["b.*"])
    .join("bw.book_id", "b")
    .where('b.id = bw.book_id')
    .andWhere({'bw.word': {$re: reg.toLowerCase()}})
    .orderBy({ books: { bc: QueryOrder.DESC } }) */

    return res
  }

  /** Auto-completion request.
   * Return a list of words that start with the given prefix.
   * if the word size is less than 3, return an empty list.
   *
   * @param param0
   * @returns
   */
  async completion({ request }: HttpContext) {
    // example: word="ab", we find all words that start with "ab" by using the regexp "ab.*"
    const word: string = request.input('word', '')
    if (word.length < 3) return []
    const qb = db.em.getConnection()
    const res = await qb.execute(`
        SELECT DISTINCT word
        FROM book_words
        WHERE word regexp '^${word.toLowerCase()}.*'
        LIMIT 15;
    `)
    return res
  }
}
