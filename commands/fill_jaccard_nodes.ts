import Book from '#models/book'
import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class FillJaccardNodes extends BaseCommand {
  static commandName = 'fill:jaccard-nodes'
  static description = 'The fourth command to run, calculate and assign the jaccard index for every pair of books. (Beware its quite long)'

  books: Book[] = []
  instanciated = false

  async prepare() {
    this.books = await Book.all()
    const cpt = await db.from("jaccard_nodes").limit(1)
    this.instanciated = cpt.length != 0
  }

  async run() {
    if (this.instanciated) this.logger.info("JaccardNodes table already instanciated")
    else {
      for (let i = 0; i < this.books.length; i++) {
        const book = this.books[i]
        console.log(`${i}/${this.books.length}`)
        await db.rawQuery(` 
        INSERT INTO jaccard_nodes (book_id_1, book_id_2, grade)
        SELECT
            BK1.book_id AS book1_id,
            BK2.book_id AS book2_id,
            CASE
                WHEN SUM(MAX(BK1.occurrence, COALESCE(BK2.occurrence, 0))) > 0 THEN
                    1 - CAST(SUM(MIN(BK1.occurrence, COALESCE(BK2.occurrence, 0))) AS FLOAT) / SUM(MAX(BK1.occurrence, COALESCE(BK2.occurrence, 0)))
                ELSE
                    0
            END AS jaccard_index
        FROM
            book_words BK1
        LEFT JOIN
            book_words BK2 ON BK1.word_id = BK2.word_id
        WHERE
            BK1.book_id < BK2.book_id AND BK1.book_id = ${book.id}
        GROUP BY
            BK1.book_id, BK2.book_id;
        `)
      }
    }

  }
}