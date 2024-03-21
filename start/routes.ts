/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BooksController from '#controllers/books_controller'
import router from '@adonisjs/core/services/router'


router.get('books', [BooksController, 'index'])
router.get('search', [BooksController, 'search'])
