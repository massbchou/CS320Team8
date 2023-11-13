// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import { MongoClient } from "mongodb";
import Image from "next/image";
import Feature from "./feature.js";
import background from "./images/background.png";
import React from "react";
import DateChooser from "../app/dateChooser";
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
      <div style={{ width: "100%", justifyContent: "center", margin: "auto" }}>
        <DateChooser />
      </div>
    </main>
  );
}
