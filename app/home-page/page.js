// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import { MongoClient } from "mongodb";
import Image from "next/image";
import Feature from "../feature.js";
import top_posts_algo from "../top-posts/top_posts.js";
import top_users_algo from "../most-active-users/top_users.js";
import { Young_Serif } from "next/font/google";
import RangeChooser from "../userInput/RangeChooser.js";
import { getForumActivity } from "../forum-activity/forum_activity.js";
import dynamic from 'next/dynamic';

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default async function Page() {
  const ActivityGraph = dynamic(() => import('../forum-activity/activity_graph.js'), { ssr: false })

  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let topPosts;
  let topUsers;
  let topPhrases;
  let inputText = "";
  let unansweredCount;
  let unansweredTitles;
  let collectionDate = "";
  let farthestPastDate = "";
  let forumActivity, startDate, endDate;
  // Create initially empty input text variable

  try {
    await client.connect();
    // Connect to cluster

    const userCollection = client
      .db("userInput")
      .collection("dates")
      .find()
      .sort({ _id: -1 })
      .limit(1);
    let userInput = await userCollection.toArray();

    farthestPastDate = userInput[0].date[0];

    // Set collection date
    collectionDate = userInput[0].date[1];

    // Get the number of days prior they want included
    let thresholdDaysPrior = userInput[0].date[2];
    const collection = client.db("posts").collection(collectionDate);
    // get collection "2022-09-15" from database "posts"

    const unanswered = collection.find({
      type: "question",
      $nor: [
        { modAnsweredAt: { $exists: true } },
        { comments: { $elemMatch: { endorsed: true } } },
      ],
    });
    let unansweredArr = await unanswered
      .toArray()
      .then((arr) => arr.filter((x) => !(x.body.substring(0, 3) === "zzz")));
    // find posts that are not either (a) answered by mods or (b) have endorsed comments !(a or b)

    unansweredCount = unansweredArr.length;
    // get the length of the original unanswered array

    unansweredTitles = unansweredArr.map(
      (e) => e.title.substring(0, 18) + "...",
    );
    // get the titles of the oldest 5 unanswered posts
    // .filter(e => !(e.substring(0, 3) === 'zzz'));
    // ^^ use this to filter out the private posts

    if (unansweredArr.length > 5) {
      unansweredTitles = unansweredTitles.slice(0, 5);
    }
    // if there are more than 5 unanswered posts, cut the list down to 5

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
        pythonPath: "python",
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
      let postData = await entry_data
        .toArray()
        .then((arr) => arr.filter((x) => x.body.substring(0, 3) !== "zzz"));
      if (Object.keys(postData).length === 0) {
        //there were no posts
        console.log("there are no posts");
        topPosts = [];
      } else {
        topPosts = top_posts_algo(postData, collectionDate);
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
      if (topUsers.length > 5) {
        topUsers = topUsers.slice(0, 5);
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

    // forum activity
    const allPosts = await collection.find().toArray();
    startDate = new Date(farthestPastDate);
    endDate = new Date(collectionDate);
    forumActivity = getForumActivity(allPosts, startDate, endDate);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
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
            fontFamily: youngSerif,
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
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width:'100%',
          }}
        >
          <Feature title="Trending Topics" content={topPhrases}></Feature>
          <Feature
            hasButton={true}
            linkTo="most-active-redux"
            totalCount={unansweredCount}
            title="Unanswered Questions"
            content={unansweredTitles}
          ></Feature>
          <Feature
            hasButton={true}
            linkTo="top-posts"
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
        <ActivityGraph
            data={forumActivity}
            startDate={startDate}
            endDate={endDate}
          />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 242, 255, 0.45), rgba(255, 0, 242, 0.55))",
              borderRadius: "10px",
              padding: "5px",
              width: "350px",
            }}
          >
            <RangeChooser />
          </div>
          <div
            style={{
              fontFamily: "Montserrat",
              fontSize: "17px",
              margin:'10px',
            }}
          >
            Current Range: {farthestPastDate} to {collectionDate}
          </div>
        </div>
      </div>
    </main>
  );
}
