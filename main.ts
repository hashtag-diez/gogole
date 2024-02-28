import lemmatizer from 'lemmatizer'
import { removeStopwords } from 'stopword'
const documentPreProcessing = (documentContent: string) => {
    return lemmatization(filterUnPertinentWords(tokenization(documentContent)))
}

const lemmatization = (tokens: string[]) => tokens.map((token) => lemmatizer(token))

const filterUnPertinentWords = (tokens: string[]) => removeStopwords(tokens)

const tokenization = (documentContent: string) => {
  const notAlphabeticCharacter: RegExp = /[^a-zA-Z]+/
  return documentContent.split(notAlphabeticCharacter)
}

const document: string = ""  
console.log(documentPreProcessing(document))
