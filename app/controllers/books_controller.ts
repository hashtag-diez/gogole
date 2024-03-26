// import type { HttpContext } from '@adonisjs/core/http'

import Books from '#models/books.entity'
import { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/db'

export default class BooksController {

  async index({ request }: HttpContext) {
    const index = request.input('page', 1)
    return db.em.find(Books, {}, {
      limit: 10,
      offset: (index - 1) * 50
    })
  }

  async search({ request }: HttpContext) {
    const reg: string = request.input('query', '')
    if (reg != "") {
      const qb = db.em.getConnection()
      const res = await qb.execute(`
          SELECT b.*
          FROM books b
          JOIN book_words bw ON b.id = bw.book_id
          WHERE bw.word regexp '${reg.toLowerCase()}'
          ORDER BY b.bc DESC
          LIMIT 10;
      `)
      return res
    } else {
      const id: number = request.input('id', 1)
      return db.em.findOne(Books, {
        id: id
      })
    }
  }
}
