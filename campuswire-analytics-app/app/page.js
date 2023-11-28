// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import { MongoClient } from "mongodb";
import Image from "next/image";
import Feature from "./feature.js";
import background from "./images/background.png";
import top_posts_algo from "./top_posts.js";
import top_users_algo from "./top_users.js";
import RangeChooser from "./userInput/RangeChooser.js";

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

    const userCollection = client.db("userInput").collection("dates").find().sort({_id:-1}).limit(1);
    let userInput = await userCollection.toArray();

    // Set collection date
    let collectionDate = userInput[0].date[1];
   
    // Get the number of days prior they want included
    let thresholdDaysPrior = userInput[0].date[2];

    // let collectionDate = '2022-10-15';
    // let thresholdDaysPrior = 20;

    // State for collection date and threshold days
    let cacheCollection = client.db("caching").collection("trending topics");
    let cache = await cacheCollection.findOne({
      collectionDate: collectionDate,
    });
    // Try to find the cache entry with the corresponding collectionDate

    if (cache === null) {
      // If the entry does not exist, generate it
      const MAX_DAYS_OLD = 20;
      let comparisonDate = new Date(
        new Date(collectionDate).getTime() - 1000 * 60 * 60 * 24 * MAX_DAYS_OLD,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let cursor = client
        .db("posts")
        .collection(collectionDate)
        .find({ publishedAt: { $gt: comparisonDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      let arr = await cursor.toArray();
      // Turn cursor into an array of post objects

      arr = arr.filter((x) => x.body.substring(0, 3) !== "zzz");
      // Filter out all fake entries that start with 'zzz'

      arr.forEach(function (x) {
        if (x.body.indexOf("![") >= 0) {
          let start =
            Math.max(x.body.lastIndexOf(".png)"), x.body.lastIndexOf(".jpg)")) +
            5;
          x.body =
            x.body.substring(0, x.body.indexOf("![")) + x.body.substring(start);
        }
      });
      // Remove all embedded images

      for (const element of arr) {
        inputText += element.title + " " + element.body + " ";
      }
      // Generate concatenation of all remaining title and body texts

      inputText = inputText.replaceAll("\n", " ");
      // Remove all newlines

      const { PythonShell } = require("python-shell");

      await PythonShell.run("./app/keyword_extractor.py", {
        mode: "json",
        pythonPath: "py",
        args: [inputText],
      }).then((msg) => {
        topPhrases = msg[0];
      });
      // Spawn Python process, pass it the text
      // When the output from the script is receieved, capture it

      await cacheCollection.insertOne({
        collectionDate: collectionDate,
        topPhrases: topPhrases,
      });
      // Insert the generated keywords into the cache database
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPhrases = cache.topPhrases;
    }

    //Same idea but for top posts now
    let cacheCollectionPosts = client.db("caching").collection("top posts");
    let cachePosts = await cacheCollectionPosts.findOne({
      collectionDate: collectionDate,
      thresholdDaysPrior: thresholdDaysPrior,
    });

    if (cachePosts === null) {
      //if the entry does not exist generate it
      let compDate = new Date(
        new Date(collectionDate).getTime() -
          1000 * 60 * 60 * 24 * thresholdDaysPrior,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client
        .db("posts")
        .collection(collectionDate)
        .find({ publishedAt: { $gt: compDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date
      let postData = await entry_data.toArray().then((arr) =>
        arr.filter((x) => x.body.substring(0, 3) !== "zzz"),
      )
      if(Object.keys(postData).length === 0){//there were no posts
        console.log("there are no posts");
        topPosts = [];
      }
      else{
        topPosts = top_posts_algo(
          postData,
          collectionDate,
        );
      }
      await cacheCollectionPosts.insertOne({
        collectionDate: collectionDate,
        thresholdDaysPrior: thresholdDaysPrior,
        topPosts: topPosts,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPosts = cachePosts.topPosts;
    }

    //Same idea for top users now
    let cacheCollectionUsers = client.db("caching").collection("top users");
    let userRole = "all"; // "member" | "moderator" | "all"
    let cacheUsers = await cacheCollectionUsers.findOne({
      collectionDate: collectionDate,
      thresholdDaysPrior: thresholdDaysPrior,
      role: userRole,
    });

    if (cacheUsers === null) {
      //if the entry does not exist generate it
      let endDate = new Date(collectionDate);
      let beginDate = new Date(
        new Date(collectionDate).getTime() -
          1000 * 60 * 60 * 24 * thresholdDaysPrior,
      );
      // Finds all posts made by all users -- see students vs moderators in most-active-users/page.js
      let user_data = client.db("users").collection("users");
      // filter users by role, unless role is "all" which gets all users
      user_data =
        userRole === "all"
          ? user_data.find()
          : user_data.find({ "author.role": userRole });

      let user_arr = await user_data.toArray();
      // Gets the data as an array

      const filteredDocuments = user_arr.map((entry) => {
        //for every post within the collection
        const filteredDocument = { _id: entry._id, author: entry.author };

        for (const key in entry) {
          //for every field in the entry find the ones that are dates (so exclude id and author)
          if (["_id", "author"].includes(key)) continue;

          const date = new Date(key);
          if (beginDate <= date && date <= endDate) {
            //find what dates come before the end threshold (collectionDate), and after the begin threshold (20 days prior to collectionDate)
            filteredDocument[key] = entry[key]; //adds the date field if its within the date range (the field that stores the values postIds, commentIds, postCount, commentCount, totalCount)
          }
        }
        return filteredDocument;
      });

      const filteredArray = filteredDocuments.filter(
        (doc) => Object.keys(doc).length > 2,
      );

      //filters out all the entries that have no posts or comments because they have no date fields because they only have id and author fields
      topUsers = top_users_algo(filteredArray, beginDate, endDate);
      if(topUsers.length > 5){
        topUsers = topUsers.slice(0,5);
      }
      await cacheCollectionUsers.insertOne({
        collectionDate: collectionDate,
        thresholdDaysPrior: thresholdDaysPrior,
        role: userRole,
        topUsers: topUsers,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topUsers = cacheUsers.topUsers;
    }
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
          title="Trending Topics"
          content={topPhrases}
        ></Feature>
        <Feature
          hasButton={true}
          linkTo="most-active-redux"
          title="Top Posts"
          content={topPosts}
        ></Feature>
        <Feature
          hasButton={true}
          linkTo="most-active-users"
          title="Most Active Users"
          content={topUsers}
        ></Feature>
      </div>
      <div>
        <RangeChooser/>
      </div>
    </main>
  );
}