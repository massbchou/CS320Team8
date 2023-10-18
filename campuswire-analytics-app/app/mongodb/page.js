// import styles from "./page.module.css";
import { MongoClient } from "mongodb";

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let results;
  try {
    // connect to mongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // get collection "2022-12-15" from database "posts" gives access to all the posts
    const collection = client.db("posts").collection("2022-12-15");

    // find all posts from September with viewsCount > 100
    const cursor = collection.find({publishedAt: {$regex: '2022-09'}, viewsCount: {$gt: 100}}).sort({viewsCount:-1});
    results = await cursor.toArray();
    // console.log(results);
  } catch (e) {
    console.log("There was an error in connecting to mongo")
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Results from query for 3 most popular posts from September:</div>
      <div>
        {results.filter((res, i)=> i<3).map((res, i) => (
          <div key={i}>
            <p className="m-3">{i + 1}. Title: &quot;{res.title}&quot; ({res.viewsCount} views)</p>
            <p className="m-3">Views: {res.viewsCount}</p>
            <p className="m-3">Date published: {res.publishedAt.substr(0,10)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
