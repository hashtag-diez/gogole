import Books from '#models/books.entity'
import JaccardNodes from '#models/jaccard_nodes.entity'
import { BaseCommand } from '@adonisjs/core/ace'
import { db } from "#services/db"
import cytoscape from 'cytoscape'
import Suggestions from '#models/suggestions.entity'

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
        graph.add({ data: { id: book.id.toString() } })
      })

      for (const node of this.nodes) {
        if (node.grade <= average) {
          try {
            graph.add({
              data: { id: `${node.book_id_1}${node.book_id_2}`, source: node.book_id_1.toString(), target: node.book_id_2.toString() }
            })
          } catch (e) {

          }
        }
      }
      this.logger.info("Graph completed")
      const bg = graph.$("").betweennessCentrality({})
      this.logger.info("Betweeness Centrality computed")

      for (const book of this.books) {
        const id = book.id.toString()
        const node = graph.$id(id)
        const bc = bg.betweenness(node)
        book.bc = bc
      }
      await db.em.flush()

      for (const book of this.books) {
        const node = graph.$id(book.id.toString())
        const similar = node.neighborhood().nodes().sort((node1, node2) => bg.betweenness(node2) - bg.betweenness(node1)).map(node => parseInt(node.id())).slice(0, 10)
        console.log(`${book.id} : ` + similar.toString())
        const similar_books = this.books.filter(book => book.id in similar)
        const suggestions = new Suggestions()
        suggestions.book = book
        suggestions.similar.set(similar_books)
        await db.em.persistAndFlush(suggestions)
      }
    }
  }

}