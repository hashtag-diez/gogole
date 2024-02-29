import { test } from '@japa/runner'
import { documentPreProcessing, tokenization } from '../../../start/indexation/indexation.ts'

test.group('Indexation pre processing', () => {
  test('tokenisation split a text with non alaphabetic character as separator', async ({ assert }) => {
    const text = 'Hello-World'
    const result: string[] = tokenization(text)
    assert.equal(result.includes('Hello'), true)
    assert.equal(result.includes('World'), true)
  })
  test('text pre processing produces tokens and their occurence in the text source', async ({ assert }) => {
    const text = 'Hello-world. Yes hello everyone!'
    const result = documentPreProcessing(text)
    assert.equal(result['hello'], 2)
    assert.equal(result['world'], 1)
    assert.equal(result['everyone'], 1)
  })
})
