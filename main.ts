import { lemmatizer } from 'lemmatizer'
import { removeStopwords } from 'stopword'
const documentPreProcessing = (documentContent: string) => {
    return lemmatization(filterUnPertinentWords(tokenization(documentContent)))
}

const lemmatization = (tokens: string[]) => tokens.map((token) => lemmatizer(token.toLowerCase()))

const filterUnPertinentWords = (tokens: string[]) => removeStopwords(tokens)

const tokenization = (documentContent: string) => {
  const notAlphabeticCharacter: RegExp = /[^a-zA-Z]+/
  return documentContent.split(notAlphabeticCharacter)
}

const api: string = "https://www.gutenberg.org/cache/epub/1/pg1.txt"
const request = fetch(api)
request.then((response) => response.text()).then((data) => console.log(documentPreProcessing(data)))
