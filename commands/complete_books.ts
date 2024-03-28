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
      /* const average = 0.75

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
      } */
      this.logger.info("Graph completed")
      // const bg = graph.$("").betweennessCentrality({})
      this.logger.info("Betweeness Centrality computed")

      /*       for (const book of this.books) {
              const id = book.id.toString()
              const node = graph.$id(id)
              const bc = bg.betweenness(node)
              book.bc = bc
            } */
      
      await db.em.flush()
      let i = 1
      for (const book of this.books) {
        i++
        console.log(`${i}/1708`)
        // const similar = node.neighborhood().nodes().map(node => parseInt(node.id()))
        const similar =
          this.nodes.filter(node => node.book_id_1 == book.id || node.book_id_2 == book.id)
            .sort((node1, node2) => node1.grade - node2.grade)
            .slice(0, 10)
            .map(node => db.em.getReference(Books,(node.book_id_1 == book.id ? node.book_id_2 : node.book_id_1)))
        shuffleArray(similar)
        const suggestions = new Suggestions()
        suggestions.book = book
        suggestions.similar.add(similar)
        db.em.persist(suggestions)
      }
      await db.em.flush()
    }
  }
}

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}