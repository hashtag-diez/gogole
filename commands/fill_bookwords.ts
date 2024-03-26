import Books from '#models/books.entity'
import BookWord from '#models/book_words.entity'
import Words from '#models/words.entity'
import { db } from "#services/db"
import { BaseCommand, args } from '@adonisjs/core/ace'
import { documentPreProcessing } from '../start/indexation/indexation.js'

export default class FillBookwords extends BaseCommand {
  static commandName = 'fill:bookwords'
  static description = 'The second command to run, associate every word from a book with its occurrence. Need to be re-run after filling the words table (A bit long)'

  public static options = {
    startApp: true,
  };
  
  books: Books[] = []
  words: Record<string, number> = {}

  @args.string()
  declare start: string
  
  async prepare() {
    this.books = await db.em.findAll(Books)
    const words = await db.em.findAll(Words)
    words.forEach(x => this.words[x.word] = x.id)
  }

  async run() {
    let start = parseInt(this.start)
    let i = start+1;
    for (let j = start; i<start+130; j++) {
      const book = this.books[j]
      console.log(`${i}/${this.books.length}`)
      try {
        let request = null
        while(request==null){
          try {
            request = await fetch(book.filepath)
          } catch (error) {

          }
        }
        const content = await request.text()
        const tokens_occ = documentPreProcessing(content)
        const entries = []
        for (const token of Object.keys(tokens_occ)) {
          const bw = new BookWord()
          bw.book = book
          bw.word = token
          bw.occurrence = tokens_occ[token]
          entries.push(bw)
        }
        let start = 0
        let end = 500
        while (start != entries.length) {
          db.em.persistAndFlush(entries.slice(start, end))
          start = end
          end = Math.min(end + 500, entries.length)
        }
      } catch (error) {
        this.logger.error(error)
      }
      i++
    }
  }
}