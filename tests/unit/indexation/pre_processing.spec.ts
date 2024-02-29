import { test } from '@japa/runner'
import { documentPreProcessing, tokenization } from '../../../start/indexation/indexation.ts'

test.group('Indexation pre processing', () => {
  test('tokenisation split a text with non alaphabetic character as separator', async ({ assert }) => {
    const text = 'Hello-World'
    const result: string[] = tokenization(text)
    assert.equal(result.includes('Hello'), true)
    assert.equal(result.includes('World'), true)
  })
  test('word occurence', async ({ assert }) => {
    const text = 'hello world'
    const result = documentPreProcessing(text)
    assert.equal(result['hello'], 1)
    assert.equal(result['world'], 1)
  })
})

