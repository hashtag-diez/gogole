import Book from '#models/book'
import JaccardNode from '#models/jaccard_node'
import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import cytoscape from 'cytoscape'

export default class CompleteBooks extends BaseCommand {
  static commandName = 'complete:books'
  static description = 'The fifth and last command, complete every books with its between centrality, based on jaccard_nodes table.'

  books: Book[] = []
  nodes: JaccardNode[] = []

  public static options = {
    startApp: true,
  };

  async prepare(..._: any[]) {
    this.books = await Book.all()
    this.nodes = await db.from("jaccard_nodes")
  }
  async run() {
    if (this.books.length == 0) this.logger.error("Books table not instanciated")
    else {
      const [avg] = await JaccardNode.query().avg("grade")
      const average = avg.$extras['avg(`grade`)'] as number

      const graph = cytoscape({})
      this.books.forEach(book => {
        if (book.id == 72979) console.log(book.id)
        graph.add({ data: { id: book.id.toString() } })
      })


      for (const node of this.nodes) {
        if (node.grade <= average) {
          try {
            graph.add({
              data: { id: `${node.book_id_1}${node.book_id_2}`, source: node.book_id_1.toString(), target: node.book_id_2.toString() }
            })
          } catch (e) {
            this.logger.error(e)
          }
        }
      }

      const bg = graph.$("").betweennessCentrality({})

      for (const book of this.books) {
        const id = book.id.toString()
        const node = graph.$id(id)
        const bc = bg.betweenness(node)
        await Book.query().where('id', book.id).update({ bc: bc })
      }
    }
  }

}