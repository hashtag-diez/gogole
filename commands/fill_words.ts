import { BaseCommand } from '@adonisjs/core/ace'
import { db } from "#services/db"
import Words from '#models/words.entity'


export default class FillWords extends BaseCommand {
  static commandName = 'fill:words'
  static description = 'The third command to run, list the distinct words present in book_words and assign an id to it. fill:bookwords has to be run after this.'

  instanciated = false

  public static options = {
    startApp: true,
  };
  
  async prepare() {
    let cpt = await db.em.find(Words, {}, {limit: 1})
    this.instanciated = cpt.length != 0 
  }

  async run() {
    if(this.instanciated) this.logger.info("Words table already filled")
    const qb = db.em.getConnection()
    await qb.execute(`
      INSERT INTO Word (word)
      SELECT DISTINCT word
      FROM BookWord;    
    `)
  }
}