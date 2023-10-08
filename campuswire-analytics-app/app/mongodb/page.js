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

    // get collection "2022-09-15" from database "posts"
    const collection = client.db("posts").collection("2022-09-15");

    // find all posts with viewsCount > 300
    const cursor = collection.find({ viewsCount: { $gt: 300 } });
    results = await cursor.toArray();
    // console.log(results);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <div>results from query for popular posts (viewsCount &gt; 300):</div>
      {results.map((res, i) => (
        <div key={i}>
          <p className="m-3">
            {i + 1}. Title: &quot;{res.title}&quot; ({res.viewsCount} views)
          </p>
          <p className="m-3">Body: &quot;{res.body}&quot;</p>
          <p className="m-3">Response: &quot;{res.comments[0].body}&quot;</p>
        </div>
      ))}
    </main>
  );
}
