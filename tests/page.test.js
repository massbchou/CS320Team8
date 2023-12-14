import "@testing-library/jest-dom";
import { MongoClient } from 'mongodb';
import { formatInput } from '../app/page.js'
import { extractKeywords } from '../app/page.js'
import { generateCache } from '../app/page.js'
const { PythonShell } = require('python-shell');

const connectionString = 'mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority';
let client;
let database;
let collection;
let dataArray;

beforeAll(async () => { //runs before all tests, establish a connection to the MongoDB server
  client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  await client.connect()

  database = client.db('testing')
  collection = database.collection('2022-09-28')
  dataArray = await collection.find().toArray()
});

afterAll(async () => { //runs after all tests are done, closes connection
  await client.close();
});

describe('formatInput', () => {
  it('removes all private posts', () => {
    let outputString = formatInput(dataArray)
    expect(outputString).toEqual(expect.not.stringContaining('zzz'))
  });

  it('removes all images', () => {
    let outputString = formatInput(dataArray)
    expect(outputString).toEqual(expect.not.stringContaining('.png'))
    expect(outputString).toEqual(expect.not.stringContaining('.jpg'))
  });

  it('removes all newlines', () => {
    let outputString = formatInput(dataArray)
    expect(outputString).toEqual(expect.not.stringContaining('\n'))
  });

  it('behaves correctly with no input', () => {
    let outputString = formatInput([])
    expect(outputString).toEqual("")
  });
});

describe('extractKeywords', () => {
  it('outputs keywords with multiple occurrences', () => {
    let outputString = formatInput(dataArray)
    let topPhrases = extractKeywords(outputString)

    for (keyword in topPhrases){
      expect(outputString.split(keyword).length - 1).toBeGreaterThan(1)
    }
  });

  it('handles empty string input', async () => {
    let topPhrases = await extractKeywords("")
    expect(topPhrases).toEqual([])
  });

  it('handles empty input', async () => {
    let topPhrases = await extractKeywords()
    expect(topPhrases).toEqual([])
  }); //currently doesn't pass bc ["undefined",] is returned

  it('handles Python script error', async () => {
    const mockRun = jest.spyOn(PythonShell, 'run').mockRejectedValue(new Error('simulated Python error'));
    let extractedKeywords;
    try {
      extractedKeywords = await extractKeywords(formatInput(dataArray))
    } catch (error) {
      expect(error.message).toBe('simulated Python error')
    } finally {
      mockRun.mockRestore();
    }
    expect(extractedKeywords).toBeUndefined()
  });
});

describe('generateCache', () => {
  it('adds data to cache database if its not already there', async () => {
    let cacheCollection = client.db('testing').collection('test-cache')
    let postCollection = client.db('testing').collection('2022-09-28')
    await generateCache(cacheCollection, postCollection, '2022-09-28')

    let cache = await cacheCollection.find()
    expect(cache).not.toBeNull()

    await cacheCollection.deleteMany({})
  });

  it('calls with incorrect date format are not added to cache', async () => {
    let cacheCollection = client.db('testing').collection('test-cache')
    let postCollection = client.db('testing').collection('2022-09-28')
    await generateCache(cacheCollection, postCollection, '9-28-22')

    let cache = await cacheCollection.find()
    expect(cache).toBeNull()
    await cacheCollection.deleteMany({})
  });

  it('adds data with correct date range', async () => {
    let cacheCollection = client.db('testing').collection('test-cache')
    let postCollection = client.db('testing').collection('2022-10-01')
    await generateCache(cacheCollection, postCollection, '2022-10-01')

    let comparisonDate = new Date('2022-10-01').getTime() - (1000 * 60 * 60 * 24 * 15);
    let cache = await cacheCollection.find()
    let arr = await cache.toArray();

    for (let doc of arr) {
      let dateInt = new Date(doc.collectionDate).getTime() - (1000 * 60 * 60 * 24 * 15);
      expect(dateInt).toBeGreaterThan(comparisonDate)
    }

    await cacheCollection.deleteMany({})
  });
});