import background from "../images/background.png";
import { MongoClient } from "mongodb";
import top_users_algo from "../top_users.js";
import Feature from "../feature.js";

export default async function Page() {
  // initialize mongoclient credentials
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  let topStudents1 = [];
  let topStudents2 = [];
  let topStudents3 = [];
  let topMods = [];
  try {
    await client.connect();
    const userCollection = client.db("users").collection("users");
    const studentData = userCollection.find({ "author.role": "member" });
    const studentList = await studentData.toArray();
    const modData = userCollection.find({ "author.role": "moderator" });
    const sep1 = new Date("2022-09-01");
    const oct1 = new Date("2022-10-01");
    const dec1 = new Date("2022-12-01");
    const dec31 = new Date("2022-12-31");
    // beginning of semester (<=sep 15) to oct 1
    topStudents1 = top_users_algo(studentList, sep1, oct1);
    // oct 1 to dec 1
    topStudents2 = top_users_algo(studentList, oct1, dec1);
    // oct 1 to end of semester (>=dec 15)
    topStudents3 = top_users_algo(studentList, oct1, dec31);
    // mods for entire semester
    topMods = top_users_algo(await modData.toArray(), sep1, dec31);
  } catch (e) {
    console.log("There was an error in connecting to mongo");
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <header>Most Active Users</header>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <Feature
          linkTo="most-active-users"
          title="Most Active Students: beginning of semester (sep 15) - oct 1"
          content={topStudents1}
        ></Feature>
        <Feature
          linkTo="most-active-users"
          title="Most Active Students: oct 1 - dec 1"
          content={topStudents2}
        ></Feature>
        <Feature
          linkTo="most-active-users"
          title="Most Active Students: dec 1 - end of semester (dec 15)"
          content={topStudents3}
        ></Feature>

        <Feature
          linkTo="most-active-users"
          title="Most Active Mods"
          content={topMods}
        ></Feature>
      </div>
    </main>
  );
}