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
import JaccardNode from '#models/jaccard_node'

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
    let books = await Book.all();
    for(let i=0; i<books.length; i++){
      let book1 = books[i];
      let keyword1 = await BookWord.query().where("book_id",book1.id)
      const entries = []
      for(let j=i; i<books.length; i++){
        let book2 = books[j];
        let keyword2 = await BookWord.query().where("book_id",book2.id)
        let jaccard_grade = getJaccardGrade(transformBookWords(keyword1), transformBookWords(keyword2))
        entries.push({
          book_id_1: book1.id,
          book_id_2: book2.id,
          grade: jaccard_grade
        })
      }
      let start = 0
      let end = 250
      while (start != entries.length) {
        await JaccardNode.createMany(entries.slice(start, end))
        start = end
        end = Math.min(end + 250, entries.length)
      }
    }
  }
  return "good"
})

var transformBookWords = (book_words: BookWord[]) => {
  let transformed_book_words: Map<string,number> = new Map()
  book_words.forEach((book_word) => {
    transformed_book_words.set(book_word.word,book_word.occurrence)
  })
  return transformed_book_words
}

var getJaccardGrade = (map1: Map<string,number>, map2: Map<string,number>) => {
  let union_count = 0;
  let intersection_count = 0;
  let common_words: Map<string,boolean> = new Map()
  for(const key of map1.keys()){
    if(map2.get(key)!=undefined){
      intersection_count+=Math.min(map1.get(key) as number,map2.get(key) as number)
      union_count+=Math.max(map1.get(key) as number,map2.get(key) as number)
      common_words.set(key,true)
    }else{
      union_count+=map1.get(key) as number
    }
  }

  for(const key of map2.keys()){
    if(common_words.get(key))
      continue
    else
      union_count+=map2.get(key) as number
  }

  return 1 - intersection_count/union_count
}

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