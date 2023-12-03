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

  // Check if a document with the same user ID already exists

  const db = client.db("userInput");
  const collection = db.collection("userName");
  const existingUser = collection.find({});
  console.log(existingUser);

  if (existingUser) {
    await collection.updateOne({}, { $set: { user: user } });
  }

  client.close();
  return Response.json({ user });
}
