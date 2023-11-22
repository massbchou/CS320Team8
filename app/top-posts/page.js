import { MongoClient } from "mongodb";
import top_posts_algo from "./top_posts.js";
import Feature from "../feature.js";

export default async function Page() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  let topPosts1 = [];
  let topPosts2 = [];
  let topPosts3 = [];
  let topPosts4 = [];
  let topPostsOfAllTime = [];

  try {
    await client.connect();
    let postsCollection = client.db("caching").collection("top posts");
    let cache1Posts = await postsCollection.findOne({
      //Posts from Sept 01 to Sept 30 inclusive
      collectionDate: "2022-09-30",
      thresholdDaysPrior: 29,
      hasDecay: false,
    });
    let cache2Posts = await postsCollection.findOne({
      //Posts from Oct 01 to Oct 31 inclusive
      collectionDate: "2022-10-31",
      thresholdDaysPrior: 30,
      hasDecay: false,
    });
    let cache3Posts = await postsCollection.findOne({
      //Posts from Nov 01 to Nov 30 inclusive
      collectionDate: "2022-11-30",
      thresholdDaysPrior: 29,
      hasDecay: false,
    });
    let cache4Posts = await postsCollection.findOne({
      //Posts from Dec 01 to Dec 31 inclusive
      collectionDate: "2022-12-31",
      thresholdDaysPrior: 30,
      hasDecay: false,
    });
    let cacheAllPosts = await postsCollection.findOne({
      //Posts from the Whole Semester
      collectionDate: "2022-12-15",
      thresholdDaysPrior: 365,
      hasDecay: false,
    });

    if (cache1Posts === null) {
      //if the entry does not exist generate it
      let compDate = new Date(
        new Date("2022-09-30").getTime() - 1000 * 60 * 60 * 24 * 29,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client
        .db("posts")
        .collection("2022-09-30")
        .find({ publishedAt: { $gt: compDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      topPosts1 = top_posts_algo(
        await entry_data
          .toArray()
          .then((arr) =>
            arr.filter((x) => !(x.body.substring(0, 3) === "zzz")),
          ),
        "2022-09-30",
        false,
      );
      await postsCollection.insertOne({
        collectionDate: "2022-09-30",
        thresholdDaysPrior: 29,
        hasDecay: false,
        topPosts: topPosts1,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPosts1 = cache1Posts.topPosts;
    }
    if (cache2Posts === null) {
      //if the entry does not exist generate it
      let compDate = new Date(
        new Date("2022-10-31").getTime() - 1000 * 60 * 60 * 24 * 30,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client
        .db("posts")
        .collection("2022-10-31")
        .find({ publishedAt: { $gt: compDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      topPosts2 = top_posts_algo(
        await entry_data
          .toArray()
          .then((arr) =>
            arr.filter((x) => !(x.body.substring(0, 3) === "zzz")),
          ),
        "2022-10-31",
        false,
      );
      await postsCollection.insertOne({
        collectionDate: "2022-10-31",
        thresholdDaysPrior: 30,
        hasDecay: false,
        topPosts: topPosts2,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPosts2 = cache2Posts.topPosts;
    }
    if (cache3Posts === null) {
      //if the entry does not exist generate it
      let compDate = new Date(
        new Date("2022-11-30").getTime() - 1000 * 60 * 60 * 24 * 29,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client
        .db("posts")
        .collection("2022-11-30")
        .find({ publishedAt: { $gt: compDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      topPosts3 = top_posts_algo(
        await entry_data
          .toArray()
          .then((arr) =>
            arr.filter((x) => !(x.body.substring(0, 3) === "zzz")),
          ),
        "2022-11-30",
        false,
      );
      await postsCollection.insertOne({
        collectionDate: "2022-11-30",
        thresholdDaysPrior: 29,
        hasDecay: false,
        topPosts: topPosts3,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPosts3 = cache3Posts.topPosts;
    }
    if (cache4Posts === null) {
      //if the entry does not exist generate it
      let compDate = new Date(
        new Date("2022-12-31").getTime() - 1000 * 60 * 60 * 24 * 30,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client
        .db("posts")
        .collection("2022-12-15")
        .find({ publishedAt: { $gt: compDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      topPosts4 = top_posts_algo(
        await entry_data
          .toArray()
          .then((arr) =>
            arr.filter((x) => !(x.body.substring(0, 3) === "zzz")),
          ),
        "2022-12-15",
        false,
      );
      await postsCollection.insertOne({
        collectionDate: "2022-12-15",
        thresholdDaysPrior: 14,
        hasDecay: false,
        topPosts: topPosts4,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPosts4 = cache4Posts.topPosts;
    }
    if (cacheAllPosts === null) {
      //if the entry does not exist generate it
      let compDate = new Date(
        new Date("2022-12-31").getTime() - 1000 * 60 * 60 * 24 * 365,
      ).toISOString();
      // Create a new date string that represents a date MAX_DAYS_OLD days in the past in relation to the collection date

      let entry_data = client
        .db("posts")
        .collection("2022-12-15")
        .find({ publishedAt: { $gt: compDate } });
      // Finds all posts made within the past MAX_DAYS_OLD days in relation to the collection date

      topPostsOfAllTime = top_posts_algo(
        await entry_data
          .toArray()
          .then((arr) =>
            arr.filter((x) => !(x.body.substring(0, 3) === "zzz")),
          ),
        "2022-12-15",
        false,
      );
      await postsCollection.insertOne({
        collectionDate: "2022-12-15",
        thresholdDaysPrior: 365,
        hasDecay: false,
        topPosts: topPostsOfAllTime,
      });
    } else {
      // If the entry does exist, then just pull the keywords from the database
      topPostsOfAllTime = cacheAllPosts.topPosts;
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
        background: "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
    <div style ={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20px',
        alignItems: 'center',
        fontSize: "20px"
      }}> 
        <a href="http://localhost:3000" style={{display: 'inline-block'}}>
          Return Home
          <div style={{display: 'inline-block'}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2 -2 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          </div>
        </a>
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
          linkTo="top-posts"
          title="Most Popular Posts: for September"
          content={topPosts1}
        ></Feature>
        <Feature
          linkTo="top-posts"
          title="Most Popular Posts: for October"
          content={topPosts2}
        ></Feature>
        <Feature
          linkTo="top-posts"
          title="Most Popular Posts: for November"
          content={topPosts3}
        ></Feature>
        <Feature
          linkTo="top-posts"
          title="Most Popular Posts: for December"
          content={topPosts4}
        ></Feature>
        <Feature
          linkTo="top-posts"
          title="Overall Top Posts"
          content={topPostsOfAllTime}
        ></Feature>
      </div>
    </main>
  );
}

