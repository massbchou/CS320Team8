import { MongoClient } from "mongodb";
import top_users_algo from "../most-active-users/top_users";
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
    topStudents1 = top_users_algo(studentList, sep1, oct1).slice(0, 5);
    // oct 1 to dec 1
    topStudents2 = top_users_algo(studentList, oct1, dec1).slice(0, 5);
    // oct 1 to end of semester (>=dec 15)
    topStudents3 = top_users_algo(studentList, oct1, dec31).slice(0, 5);
    // mods for entire semester
    topMods = top_users_algo(await modData.toArray(), sep1, dec31).slice(0, 5);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "20px",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        <a href="/home-page" style={{ display: "inline-block" }}>
          Return Home
          <div style={{ display: "inline-block" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-2 -2 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
        </a>
      </div>
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
