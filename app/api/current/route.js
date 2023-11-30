import { MongoClient } from "mongodb";

export async function POST(request) {
  const { date } = await request.json();
  const client = await MongoClient.connect(
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
  const db = client.db("userInput");
  const collection = db.collection("dates");

  // Insert the date into the MongoDB collection
  await collection.insertOne({ date });

  client.close();

  return Response.json({date});
}