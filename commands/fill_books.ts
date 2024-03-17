import { BaseCommand } from '@adonisjs/core/ace'
import Book from "#models/book"

export default class FillBooks extends BaseCommand {
  public static commandName = 'fill:books'
  public static description = 'First request to run, fetch >1664 books from Gutenberg and put them in books table'

  instanciated = false

  public static options = {
    startApp: true,
  };

  async prepare() {
    let cpt = await Book.all()
    this.instanciated = cpt.length != 0 
  }

  async run() {
    if(this.instanciated) this.logger.info("Books table already instanciated")
    else{
      let tot = 0
      let i = 1
      while (tot < 1664) {
        console.log(Math.floor((tot * 100) / 1664) + "%")
        const req = await fetch("https://gutendex.com/books/?page=" + i)
        const data = await req.json() as { results: any[] }
        for (const entry of data.results) {
          if (entry["formats"]["text/plain; charset=us-ascii"] && entry["formats"]["image/jpeg"]) {
            try {
              await Book.create({
                id: entry["id"],
                title: entry["title"],
                subjects: JSON.stringify(entry["subjects"]),
                filepath: entry["formats"]["text/plain; charset=us-ascii"],
                imagepath: entry["formats"]["image/jpeg"],
                author: JSON.stringify(entry["authors"])
              })
              
            } catch (error) {
              this.logger.error(error)
            }
          }
        }
        tot++
        i++
      }
    }   
  }
}