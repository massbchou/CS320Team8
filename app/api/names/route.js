import { MongoClient } from "mongodb";

export async function POST(request) {
  const { user } = await request.json();
  const client = await MongoClient.connect(
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
  const db = client.db("userInput");
  const collection = db.collection("userName");

  // Insert the date into the MongoDB collection
  await collection.insertOne({ user });

  client.close();

  return Response.json({user});
}