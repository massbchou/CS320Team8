// import styles from "./page.module.css";
import { MongoClient } from "mongodb";

export default async function Mongo() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/";
  const client = new MongoClient(url);

  let ansResults;
  let endResults;
  let bothResults;

  try {
    // connect to mongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // get collection "2022-09-15" from database "posts"
    const collection = client.db("posts").collection("2022-09-15");

    // find posts that are answered by mods, posts that have endorsed comments, and posts that have both
    const modAnswered = collection.find({ modAnsweredAt: true });
    ansResults = await modAnswered.toArray();

    const endorsed = collection.find({ modAnsweredAt: true },
        { comments: { $elemMatch: { endorsed: true } } });
    endResults = await endorsed.toArray();

    const answeredEndorsed = collection.find({ modAnsweredAt: true },
                                             { comments: { $elemMatch: { endorsed: true } }  });
    bothResults = await cursor.toArray();
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  let unanswered = ansResults.size() + endResults.size() - bothResults.size();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
        <p id = "output">Unable to load content</p>
        <script>
            var outputString = document.getElementById(output);
            outputString.innerHTML = "Unanswered questions: ${unanswered}";
        </script>
    </main>
  );
}