import { lemmatizer } from 'lemmatizer'
import { removeStopwords } from 'stopword'

const countOccurence = (words: string[]) => {
  // occurences will contains words as keys and the number of occurences as values. define it with its type
  const occurences: Record<string, number> = {}
  words.forEach((word) => {
    if (!occurences.hasOwnProperty(word)) {
      occurences[word] = 0
    }
    occurences[word]++
  })
  return occurences
}

const lemmatization = (tokens: string[]) => tokens.map((token) => lemmatizer(token.toLowerCase()))

const filterUnPertinentWords = (tokens: string[]) => removeStopwords(tokens)

export const tokenization = (documentContent: string) => {
  const notAlphabeticCharacter: RegExp = /[^a-zA-Z]+/
  return documentContent.split(notAlphabeticCharacter)
}

export const documentPreProcessing = (documentContent: string): Record<string, number> => {
  return countOccurence(lemmatization(filterUnPertinentWords(tokenization(documentContent))))
}

const processBooksFromGutenberg = (books: string[]) => {  
  const api: string = "https://www.gutenberg.org/cache/epub/1/pg1.txt"
  const request = fetch(api)
  request
    .then((response) => response.text())
    .then((data) => console.log(documentPreProcessing(data)))
}
