// import styles from "./page.module.css";
import { MongoClient } from "mongodb";
import Feature from '../feature.js';

export default async function Mongo() {

  // initialize mongoclient credentials
  const url = "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let numUnanswered;
  let unansweredTitles;

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
    // get the titles of the oldest 5 unanswered posts if there are more than 5
    unansweredTitles = unansweredArr.map(e => e.title);
    // .filter(e => !e.substring(0, 3) === 'zzz');
    // ^^ stick this bad boy onto the end to filter out the private posts
    if(numUnanswered > 5)
      unansweredTitles = unansweredTitles.slice(0, 5);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <Feature title = 'Unanswered questions' content = {unansweredTitles}></Feature>
  );
}