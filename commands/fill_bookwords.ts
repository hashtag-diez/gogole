import Book from '#models/book'
import BookWord from '#models/book_word'
import Word from '#models/word'
import { BaseCommand } from '@adonisjs/core/ace'
import { documentPreProcessing } from '../start/indexation/indexation.js'

export default class FillBookwords extends BaseCommand {
  static commandName = 'fill:bookwords'
  static description = 'The second command to run, associate every word from a book with its occurrence. Need to be re-run after filling the words table (A bit long)'

  public static options = {
    startApp: true,
  };
  
  books: Book[] = []
  words: Record<string, number> = {}

  async prepare() {
    this.books = await Book.all()
    const words = await Word.all()
    words.forEach(x => this.words[x.word] = x.id)
  }

  async run() {
    let i = 1;
    for (const book of this.books) {
      console.log(`${i}/${this.books.length}`)
      try {
        const request = await fetch(book.filepath)
        const content = await request.text()
        const tokens_occ = documentPreProcessing(content)
        const entries = []
        for (const token of Object.keys(tokens_occ)) {
          entries.push({
            book_id: book["id"],
            word: token,
            occurrence: tokens_occ[token],
            word_id: this.words[token] ?? -1
          })
        }
        let start = 0
        let end = 500
        while (start != entries.length) {
          await BookWord.createMany(entries.slice(start, end))
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