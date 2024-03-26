// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/db'
import { QueryOrder } from '@mikro-orm/sqlite'
import Suggestions from '#models/suggestions.entity'

export default class SuggestionsController {

  async index({ request }: HttpContext) {
    const id: string = request.input('id', 1)
    const qb = db.em.createQueryBuilder(Suggestions, 'sugg');
    return qb
      .select("sugg.*")
      .leftJoinAndSelect('sugg.book', 'b')
      .where({"b.id": id})
      .leftJoinAndSelect('sugg.similar', 'sim')
      .orderBy({ book: { bc: QueryOrder.DESC } })
      .limit(4)
      .getResultList()
  }
}
