/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BooksController from '#controllers/books_controller'
import BookWordsController from '#controllers/bookwords_controller'
import SuggestionsController from '#controllers/suggestions_controller'
import router from '@adonisjs/core/services/router'


router.get('books', [BooksController, 'index'])
router.get('search', [BooksController, 'search'])
router.get('completion', [BookWordsController, 'completion'])
router.get('suggestions', [SuggestionsController, 'index'])