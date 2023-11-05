// mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/
import { MongoClient } from "mongodb";
import Image from "next/image";
// import goldstar_nobackground from '../public/goldstar_nobackground.png';
// import silverstar_nobackground from '../public/silverstar_nobackground.png';
// import bronzestar_nobackground from '../public/bronzestar_nobackground.png';
import Feature from "./feature.js";
import background from "./images/background.png";
import top_posts_algo from "./top_posts.js";
import prolific_users_algo from "./prolific_users.js";

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let topPosts = [];
  let prolificUsers = [];
  let inputText = "";
  // Create initially empty input text variable
  try {
    await client.connect();
    // Connect to cluster

    let cursor = await client
      .db("posts")
      .collection("2022-12-15")
      .find({})
      .limit(150);
    // Find the first x posts on this day, according to the set limit

    let arr = await cursor.toArray();
    // Turn cursor into an array of post objects

    arr = arr.filter(x => !(x.body.substring(0, 3) === "zzz"));
    // Filter out all fake entries that start with "zzz"

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

    // get collection "2022-12-15" from database "posts" gives access to all the posts
    const collection = client.db("posts").collection("2022-12-15");

    //find top posts for the Semester
    const entry_data = collection.find({ publishedAt: { $regex: "2022" } });
    topPosts = top_posts_algo(await entry_data.toArray());

    //{type:{$ne: "question"}, title:{$not: {$regex:"Office|OFFICE|office|OH"}}}

    //find most prolific users for the Semester
    //based on posts that ask are type 'question'
    const userCollection = client.db("users").collection("users");
    const users_data = userCollection.find();
    prolificUsers = prolific_users_algo(await users_data.toArray());
  } catch (e) {
    console.log("There was an error in connecting to mongo");
    console.error(e);
  } finally {
    await client.close();
  }

  const { PythonShell } = require("python-shell");

  let topPhrases;
  await PythonShell.run("./app/keyword_extractor.py", {
    mode: "json",
    pythonPath: "python",
    args: [inputText],
  }).then(msg => {
    topPhrases = msg[0];
  });

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
          content={prolificUsers}
        ></Feature>
      </div>
    </main>
  );
}
