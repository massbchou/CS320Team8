// import styles from "./page.module.css";
import { MongoClient } from "mongodb";

export default async function Mongo() {

  // initialize mongoclient credentials
  const url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let numUnanswered;

  try {
    // connect to mongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // get collection "2022-09-15" from database "posts"
    const collection = client.db("posts").collection("2022-09-15");

    // find posts that are not either (a) answered by mods or (b) have endorsed comments !(a or b)
    const unanswered = collection.find({$nor: [{modAnsweredAt: {$exists: true}}, {comments: {$elemMatch: {endorsed: true}}}] });
    let unansweredArr = await unanswered.toArray();

    // get the size of the unanswered array
    numUnanswered = unansweredArr.length;

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Unanswered questions: {numUnanswered}</p>
    </main>
  );
}