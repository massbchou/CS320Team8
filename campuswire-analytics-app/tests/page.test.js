import "@testing-library/jest-dom";
import { MongoClient } from 'mongodb';
//const { MongoMemoryServer } = require('mongodb-memory-server');
const formatInput = require("../app/page")
const extractKeywords = require("../app/page")
const generateCache = require("../app/page")
const collection = require("./2022-09-28")

// const connectionString = 'mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority';
// let client;
// let database;
// //let collection;

// beforeAll(async () => { //runs before all tests, establish a connection to the MongoDB server
//   // client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
//   // await client.connect();

//   // database = client.db('testing');
//   // collection = database.collection('2022-09-28');
// });

// afterAll(async () => { //runs after all tests are done, closes connection
//   //await client.close();
// });

 test('formatInput() removes all private posts', () => {
  let outputString = formatInput(collection)
  expect(outputString).toEqual(expect.not.stringContaining('zzz'))
});

test('formatInput() removes all images', () => {
  let outputString = formatInput(collection)
  expect(outputString).toEqual(expect.not.stringContaining('.png'))
  expect(outputString).toEqual(expect.not.stringContaining('.jpg'))
});

test('formatInput() removes all newlines', () => {
  let outputString = formatInput(collection)
  expect(outputString).toEqual(expect.not.stringContaining('\n'))
});

test('formatInput() no input', () => {
  let outputString = formatInput([])
  expect(outputString).toEqual("")
});

test('extractKeywords() outputs keywords with multiple occurrences', () => {
  let outputString = formatInput(collection)
  let topPhrases = extractKeywords(outputString)

  for (keyword in topPhrases){
    expect(outputString.split(keyword).length - 1).toBeGreaterThan(1)
  }
});

test('extractKeywords() handles Python script error', async () => {
  //simulate a Python script error
  const pythonScriptError = new Error('Simulated error');
  require('python-shell').PythonShell.run.mockRejectedValue(pythonScriptError);

  let topPhrases = await extractKeywords(formatInput(collection));

  expect(topPhrases).toBeUndefined();
});

test('generateCache() adds data to cache database if its not already there', async () => {
  let cacheCollection = client.db('testing').collection('test-cache')
  let postCollection = client.db('testing').collection('2022-09-28')
  await generateCache(cacheCollection, postCollection, '2022-09-28')

  let cache = await cacheCollection.find({collectionDate: '2022-09-28'});
  let post = await cacheCollection.find({collectionDate: '2022-09-28'});

  expect(cacheCollection.totalSize()).toBe(1)
  expect(cache).toEqual(post)
  await cacheCollection.remove({collectionDate: '2022-09-28'})
});

// test('generateCache() does not add data to cache database if its already there', async () => {
//   let cacheCollection = client.db('testing').collection('test-cache')
//   let postCollection = client.db('testing').collection('2022-09-28')

//   await generateCache(cacheCollection, postCollection, '2022-09-28') //adds to cache
//   expect(cacheCollection.totalSize()).toBe(1)
//   await generateCache(cacheCollection, postCollection, '2022-09-28') //same query, should not add anything to the cache
//   expect(cacheCollection.totalSize()).toBe(1)

//   let cache = await cacheCollection.find({collectionDate: '2022-09-28'});
//   let post = await cacheCollection.find({collectionDate: '2022-09-28'});

//   expect(cache).toEqual(post)
//   await cacheCollection.remove({collectionDate: '2022-09-28'})
// });

//add test for generateCache() correct dates