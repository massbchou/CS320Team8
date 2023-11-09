// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import { MongoClient } from "mongodb";
import Image from "next/image";
import Feature from "./feature.js";
import background from "./images/background.png";
import top_posts_algo from "./top_posts.js";
import top_users_algo from "./top_users.js";

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

  /*Caching right now is set as one entry per date. So for '2022-09-15' there is one entry and if the collectionDate is set to that string, 
  then no database query calls have to be made because it can just take array information saved at that specific collectionDate. 
  However, MAX_DAYS is hard-coded to only allow posts from 20 days prior up to the collectionDate as being queried. 
  I was thinking if we wanted to allow users to change this range to say only 7 days before the collectionDate or all possible days before the collectionDate our method currently wouldn't allow it. 
  If the current if-else statement was changed to a if-elseif-else statement where the second if conditional checked if the collectionDate with whatever desired value of MAX_DAYS has been calculated before. 
  If it has NOT been calculated before that means the same collectionDate has been calculated before, but with a different time range for allowing posts to count towards the calculation.
  So, it should be calculated and stored as having the collectionDate as its collectionDate and the MAX_DAYS as its MAX_DAYS. 
  If it HAS been calculated before that means both that collectionDay and MAX_DAYS combo has been calculated before and this is just the else statement we currently have.*/

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

      arr = arr.filter((x) => !(x.body.substring(0, 3) === "zzz"));
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

      for (let i = 0; i < arr.length; i++) {
        inputText += arr[i].title + " " + arr[i].body + " ";
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

      topPosts = top_posts_algo(
        await entry_data
          .toArray()
          .then((arr) =>
            arr.filter((x) => !(x.body.substring(0, 3) === "zzz")),
          ),
        collectionDate,
      );
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
      const endDate = new Date(collectionDate);
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
          if (beginDate < date && date < endDate) {
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
    </main>
  );
}