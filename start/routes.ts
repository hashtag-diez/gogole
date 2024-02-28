/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  let res = []
  for(let i = 0; i<1; i++){
    const req = await fetch("https://gutendex.com/books/?page=" + (i+1))
    const data = await req.json()
    const book_content = await fetch(data.results[0]["formats"]["text/plain; charset=us-ascii"])
    const data_book = await book_content.text()
    res = res.concat([data_book])
  }
  return res
})
