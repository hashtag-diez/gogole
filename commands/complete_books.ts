import Books from '#models/books.entity'
import JaccardNodes from '#models/jaccard_nodes.entity'
import { BaseCommand } from '@adonisjs/core/ace'
import { db } from "#services/db"
import cytoscape from 'cytoscape'

export default class CompleteBooks extends BaseCommand {
  static commandName = 'complete:books'
  static description = 'The fifth and last command, complete every books with its between centrality, based on jaccard_nodes table.'

  books: Books[] = []
  nodes: JaccardNodes[] = []

  public static options = {
    startApp: true,
  };

  async prepare(..._: any[]) {
    this.books = await db.em.findAll(Books)
    this.nodes = await db.em.findAll(JaccardNodes)
  }
  async run() {
    if (this.books.length == 0) this.logger.error("Books table not instanciated")
    else {
      /* const qb = db.em.createQueryBuilder(JaccardNodes) */
      /* const [avg] = await JaccardNode.query().avg("grade") */
      const average = 0.75

      const graph = cytoscape({})
      this.books.forEach(book => {
        if (book.id == 72979) console.log(book.id)
        graph.add({ data: { id: book.id.toString() } })
      })


      for (const node of this.nodes) {
        if (node.grade <= average) {
          try {
            graph.add({
              data: { id: `${node.book1.id}${node.book2.id}`, source: node.book1.id.toString(), target: node.book2.id.toString() }
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
        book.bc = bc
      }
      await db.em.flush()
    }
  }

}