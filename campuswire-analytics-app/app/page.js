// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import { MongoClient } from "mongodb";
import Image from "next/image";
import Feature from "./feature.js";
import background from "./images/background.png";
import React from 'react';
import DateChooser from '../app/dateChooser';
import handlingTopPostCaching from "./top-posts/cachingPosts.js";
import handlingTopUserCaching from "./most-active-users/cachingUsers.js";
import handlingHotTopicsCaching from "./trending-topics/cachingTopics.js";

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let topPosts;
  let topUsers;
  let topPhrases;
  let inputText = "";
  // Create initially empty input text variable


  try {
    await client.connect();
    // Connect to cluster

    let collectionDate = "2022-10-15";
    // Set collection date

    let thresholdDaysPrior = 10;
    // Get the number of days prior they want included

    let cacheCollection = client.db("caching").collection("trending topics");
    let cache = await cacheCollection.findOne({
      collectionDate: collectionDate,
    });
    // Try to find the cache entry with the corresponding collectionDate

    topPhrases = await handlingHotTopicsCaching(cache, cacheCollection);

    // if (cache === null) {
    //   // If the entry does not exist, generate it
    //   const MAX_DAYS_OLD = 20;
    //   let comparisonDate = new Date(
    //     new Date(collectionDate).getTime() - 1000 * 60 * 60 * 24 * MAX_DAYS_OLD,
    //   ).toISOString();
    //   // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

    //   let cursor = client
    //     .db("posts")
    //     .collection(collectionDate)
    //     .find({ publishedAt: { $gt: comparisonDate } });
    //   // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

    //   let arr = await cursor.toArray();
    //   // Turn cursor into an array of post objects

    //   arr = arr.filter((x) => !(x.body.substring(0, 3) === "zzz"));
    //   // Filter out all fake entries that start with 'zzz'

    //   arr.forEach(function (x) {
    //     if (x.body.indexOf("![") >= 0) {
    //       let start =
    //         Math.max(x.body.lastIndexOf(".png)"), x.body.lastIndexOf(".jpg)")) +
    //         5;
    //       x.body =
    //         x.body.substring(0, x.body.indexOf("![")) + x.body.substring(start);
    //     }
    //   });
    //   // Remove all embedded images

    //   for (let i = 0; i < arr.length; i++) {
    //     inputText += arr[i].title + " " + arr[i].body + " ";
    //   }
    //   // Generate concatenation of all remaining title and body texts

    //   inputText = inputText.replaceAll("\n", " ");
    //   // Remove all newlines

    //   const { PythonShell } = require("python-shell");

    //   await PythonShell.run("./app/keyword_extractor.py", {
    //     mode: "json",
    //     pythonPath: "py",
    //     args: [inputText],
    //   }).then((msg) => {
    //     topPhrases = msg[0];
    //   });
    //   // Spawn Python process, pass it the text
    //   // When the output from the script is receieved, capture it

    //   await cacheCollection.insertOne({
    //     collectionDate: collectionDate,
    //     topPhrases: topPhrases,
    //   });
    //   // Insert the generated keywords into the cache database
    // } else {
    //   // If the entry does exist, then just pull the keywords from the database
    //   topPhrases = cache.topPhrases;
    // }

    //Same idea but for top posts now
    let cacheCollectionPosts = client.db("caching").collection("top posts");
    let cachePosts = await cacheCollectionPosts.findOne({
      collectionDate: collectionDate,
      thresholdDaysPrior: thresholdDaysPrior,
      hasDecay: true,
    });
    topPosts = await handlingTopPostCaching(cachePosts, cacheCollectionPosts);

    //Same idea for top users now
    let cacheCollectionUsers = client.db("caching").collection("top users");
    let userRole = "all"; // "member" | "moderator" | "all"
    let cacheUsers = await cacheCollectionUsers.findOne({
      collectionDate: collectionDate,
      thresholdDaysPrior: thresholdDaysPrior,
      role: userRole,
    });
    topUsers = await handlingTopUserCaching(cacheUsers, cacheCollectionUsers);
  } catch (e) {
    console.log("There was an error in connecting to mongo");
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/images/icon.png"
          width={90}
          height={90}
          quality={100}
          style={{ margin: "10px" }}
          unoptimized
          alt=""
        ></Image>
        <span
          style={{
            fontFamily: "Roboto",
            textAlign: "center",
            fontSize: "30px",
          }}
        >
          Campuswire Analytics
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <Feature
          linkTo="trending-topics"
          title="Trending Topics"
          content={topPhrases}
        ></Feature>
        <Feature
          linkTo="top-posts"
          title="Top Posts"
          content={topPosts}
        ></Feature>
        <Feature
          linkTo="most-active-users"
          title="Most Active Users"
          content={topUsers}
        ></Feature>
      </div>
      <div style={{ width: '100%', justifyContent: 'center', margin: 'auto' }}>
        <DateChooser />
      </div>
    </main>
  );
}