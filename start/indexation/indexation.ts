import { lemmatizer } from 'lemmatizer'
import { removeStopwords } from 'stopword'

const countOccurence = (words: string[]) => {
  // occurences will contains words as keys and the number of occurences as values. define it with its type
  const occurences: Record<string, number> = {}
  const newWords = words.filter(word => word.length >= 3)
  newWords.forEach((word) => {
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
