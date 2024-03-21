import { BaseCommand } from '@adonisjs/core/ace'
import Books from "#models/books.entity"
import { db } from "#services/db"

export default class FillBooks extends BaseCommand {
  public static commandName = 'fill:books'
  public static description = 'First request to run, fetch >1664 books from Gutenberg and put them in books table'

  instanciated = false

  public static options = {
    startApp: true,
  };

  async prepare() {
    let cpt = await db.em.findAll(Books)
    this.instanciated = cpt.length != 0
  }

  async run() {
    if (this.instanciated) this.logger.info("Books table already instanciated")
    else {
      let tot = 0
      let i = 1
      while (tot < 1664) {
        console.log(Math.floor((tot * 100) / 1664) + "%")
        const req = await fetch("https://gutendex.com/books/?page=" + i)
        const data = await req.json() as { results: any[] }
        for (const entry of data.results) {
          if (entry["formats"]["text/plain; charset=us-ascii"] && entry["formats"]["image/jpeg"]) {
            try {
              const book = new Books()
              book.id = entry["id"]
              book.title = entry["title"]
              book.subjects = JSON.stringify(entry["subjects"])
              book.filepath = entry["formats"]["text/plain; charset=us-ascii"]
              book.imagepath = entry["formats"]["image/jpeg"]
              book.author = JSON.stringify(entry["authors"])
              db.em.persist(book)
            } catch (error) {
              this.logger.error(error)
            }
          }
        }
        tot++
        i++
      }
    }
    await db.em.flush()
  }
}