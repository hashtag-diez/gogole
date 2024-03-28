// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/db'
import Suggestions from '#models/suggestions.entity'

export default class SuggestionsController {

  async index({ request }: HttpContext) {
    const id: string = request.input('id', 1)
    const qb = db.em.createQueryBuilder(Suggestions, 'sugg');
    return qb
      .select("sugg.*")
      .leftJoinAndSelect('sugg.similar', 'sim')
      .where({book : {id: id}})
      .getResultList()
  }
}
