import "@testing-library/jest-dom";
import { MongoClient } from "mongodb";
import { formatInput } from "../app/page.js";
import { extractKeywords } from "../app/page.js";
import { generateCache } from "../app/page.js";
const { PythonShell } = require("python-shell");

/**
 * This file contains testing for Trending Topics and caching using Jest, a JS testing framework (currently 60% code coverage)
 * Each function is tested with one describe block, with multiple tests inside each using Jest's expect()
 * Individual tests are implemented with it()
 *
 * beforeAll() and afterAll() are run before and after tests to connect and disconnect to a test database
 */

const connectionString =
  "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
let client;
let database;
let collection;
let dataArray;

beforeAll(async () => {
  //runs before all tests, establish a connection to the MongoDB server
  client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  database = client.db("testing"); //specific smaller database with some test data and a separate cache
  collection = database.collection("2022-09-28"); //test data
  dataArray = await collection.find().toArray(); //all data from the test collection in an array
});

afterAll(async () => {
  //runs after all tests are finished, closes connection
  await client.close();
});

describe("formatInput", () => {
  //private posts contain the string "zzz", these posts should be removed
  it("removes all private posts", () => {
    let outputString = formatInput(dataArray);
    expect(outputString).toEqual(expect.not.stringContaining("zzz"));
  });

  it("removes all images", () => {
    //images shouldn't be included
    let outputString = formatInput(dataArray);
    expect(outputString).toEqual(expect.not.stringContaining(".png"));
    expect(outputString).toEqual(expect.not.stringContaining(".jpg"));
  });

  it("removes all newlines", () => {
    //newline shouldn't be included
    let outputString = formatInput(dataArray);
    expect(outputString).toEqual(expect.not.stringContaining("\n"));
  });

  it("behaves correctly with no input", () => {
    let outputString = formatInput([]);
    expect(outputString).toEqual("");
  });
});

describe("extractKeywords", () => {
  //testing extracting keywords with machine learning
  it("outputs keywords with multiple occurrences", () => {
    let outputString = formatInput(dataArray);
    let topPhrases = extractKeywords(outputString);

    for (keyword in topPhrases) {
      expect(outputString.split(keyword).length - 1).toBeGreaterThan(1); //keywords occur more than once in the input
    }
  });

  it("handles empty string input", async () => {
    let topPhrases = await extractKeywords("");
    expect(topPhrases).toEqual([]);
  });

  it("handles empty input", async () => {
    let topPhrases = await extractKeywords();
    expect(topPhrases).toEqual([]);
  }); //currently doesn't pass bc ["undefined",] is returned

  it("handles Python script error", async () => {
    //we create a python shell to run the keyword extractor, this tests if it throws an error
    const mockRun = jest
      .spyOn(PythonShell, "run")
      .mockRejectedValue(new Error("simulated Python error")); //mock a Python shell error
    let extractedKeywords;

    try {
      extractedKeywords = await extractKeywords(formatInput(dataArray));
    } catch (error) {
      expect(error.message).toBe("simulated Python error"); //expect to recieve the mocked error
    } finally {
      mockRun.mockRestore(); //clear mocks
    }
    expect(extractedKeywords).toBeUndefined(); //expect no output
  });
});

describe("generateCache", () => {
  //testing caching which is used all features, not just Trending Topics
  it("adds data to cache database if its not already there", async () => {
    let cacheCollection = client.db("testing").collection("test-cache"); //get cache (should be empty)
    let postCollection = client.db("testing").collection("2022-09-28"); //get testing data
    await generateCache(cacheCollection, postCollection, "2022-09-28"); //generate a cache for '2022-09-28'

    let cache = await cacheCollection.find();
    expect(cache).not.toBeNull(); //check that something was added to cache

    await cacheCollection.deleteMany({}); //clear testing cache for the next tests
  });

  it("calls with incorrect date format are not added to cache", async () => {
    //check that incorrect date format doesn't add to a cache
    let cacheCollection = client.db("testing").collection("test-cache");
    let postCollection = client.db("testing").collection("2022-09-28");
    await generateCache(cacheCollection, postCollection, "9-28-22"); //'9-28-22' is an incorrect date format, the 9 needs a 0 in front

    let cache = await cacheCollection.find();
    expect(cache).toBeNull(); //should be empty

    await cacheCollection.deleteMany({});
  });

  /*
  it('adds data with correct date range', async () => { //check that the posts added to the cache are in the correct range
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
  });*/
});
