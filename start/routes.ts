/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { tokenization, documentPreProcessing } from './indexation/indexation.js'

import Book from '#models/book'
import BookWord from '#models/book_word'

router.get('/', async () => {
  let cpt = await db.from("books").count("* as total")
  if (cpt[0].total == 0 || cpt[0].total == "0") {
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
            const request = await fetch(entry["formats"]["text/plain; charset=us-ascii"])
            const content = await request.text()
            const tokens_occ = documentPreProcessing(content)
            const entries = []
            for (const token of Object.keys(tokens_occ)) {
              entries.push({
                book_id: entry["id"],
                word: token,
                occurrence: tokens_occ[token]
              })
            }
            let start = 0
            let end = 750
            while (start != entries.length) {
              await BookWord.createMany(entries.slice(start, end))
              start = end
              end = Math.min(end + 500, entries.length)
            }
            tot++
          } catch (error) {
            continue
          }
        }
      }
      i++
    }
  } else {
    const req = await fetch("https://gutendex.com/books/?page=1")
    const data = await req.json() as { results: any[] }
    for (const entry of data.results) {
      console.log("Tic")
      if (entry["formats"]["text/plain; charset=us-ascii"] && entry["formats"]["image/jpeg"]) {
        const request = await fetch(entry["formats"]["text/plain; charset=us-ascii"])
        const content = await request.text()
        const tokens_occ = tokenization(content)
        for (const entry2 of data.results) {
          console.log("Tac")
          try{
            if((entry2['id'] != entry["id"]) && (entry2["formats"]["text/plain; charset=us-ascii"] && entry2["formats"]["image/jpeg"])) {
              const request = await fetch(entry2["formats"]["text/plain; charset=us-ascii"])
              const content2 = await request.text()
              const tokens_occ2 = tokenization(content2)
              var identical = identicalWordsInSentence(tokens_occ, tokens_occ2);
              var result = (identical.length / (content.length + content2.length - identical.length));
              console.log(entry["id"] + ":" + entry2["id"] + " -> " + result)
            }
          } catch (e){
            console.log(e)
          }
        }
      }
    }
  }
  return "good"
})

var exists = function(word: string, array: string[]) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] === word) {
			return true;
		}
	}
	return false;
}

var identicalWordsInSentence =  function(list1: string[], list2: string[]) {
	var identical = [];
	for(var i = 0; i < list1.length; i ++) {
		for(var j = 0; j < list2.length; j++) { 
			if(list1[i] === list2[j] && !(exists(list1[i], identical))) {
				identical.push(list1[i]);
			}
		}
	}
	return identical;
}