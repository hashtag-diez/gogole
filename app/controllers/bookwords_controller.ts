import { HttpContext } from '@adonisjs/core/http'
import { db } from '#services/db'
import BookWords from '#models/book_words.entity'

export default class BookWordsController {
  /** Auto-completion request.
   * Return a list of words that start with the given prefix.
   * if the word size is less than 3, return an empty list.
   *
   * @param param0
   * @returns
   */
  async completion({ request }: HttpContext) {
    // example: word="ab", we find all words that start with "ab" by using the regexp "ab.*"
    const word: string = request.input('query', '')
    if (word.length < 3) return []
    const res = await db.em.find(BookWords, {
      word: {$re: "^"+word+".*"}
    }, {
      fields: ["word"],
      groupBy: "word"
    })
    return res
  }
}