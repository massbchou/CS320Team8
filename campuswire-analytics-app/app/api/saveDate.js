import { MongoClient } from "mongodb";


export default async function handler(req, res) {
    const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url);
    console.log("made it to saveDate");
    if (req.method === 'POST') {
      const { userInputDate } = req.body;
  
      await client.connect();
  
      const currentDateCollection = client.db("userInput").collection('currentDate');
      console.log("Could not connect to mongo");
      
      try {
        await currentDateCollection.insertOne({ userInputDate });
        res.status(200).json({ message: 'Date saved successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Error saving date' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
}