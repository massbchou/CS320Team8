import top_users_algo from "../top_users";
import { MongoClient } from "mongodb";
import Podium from "../Podium";
import background from "../images/background.png";

export default async function Page() {
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  const firstDay = new Date("2022-09-15");
  const lastDay = new Date("2022-12-15");
  let allUsersRanked;
  let podiumData;
  try {
    await client.connect();
    let userCollection = client.db("users").collection("users");
    let usersData = userCollection.find();
    let usersList = await usersData.toArray();
    allUsersRanked = top_users_algo(usersList, firstDay, lastDay);
    podiumData = allUsersRanked
      .slice(0, 5)
      .map((name, position) => ({ name, position }));
    let namesArr = [];
    for (let i = 0; i < 5; i++) {
      namesArr.push(
        podiumData[i].name.substring(0, podiumData[i].name.indexOf(" ")),
      );
      namesArr.push(
        podiumData[i].name.substring(
          podiumData[i].name.indexOf(" ") + 1,
          podiumData[i].name.length,
        ),
      );
    }
    console.log(namesArr);

    let contributionCollection = client.db("users").collection("users");
    let queryConditions = [];

    for (let i = 0; i < namesArr.length; i += 2) {
      if (namesArr[i] && namesArr[i + 1]) {
        queryConditions.push({
          $and: [
            { "author.firstName": namesArr[i] },
            { "author.lastName": namesArr[i + 1] },
          ],
        });
      }
    }

    let contributionData = contributionCollection.find({
      $or: queryConditions,
    });
    let winnerList = await contributionData.toArray();
    console.log(winnerList);
    let count = 0;
    let winnerContributionArr = []
    for(let j = 0; j < 5; j++){//into the 5 data points one for linda one for alexander etc.
      for (let date in winnerList[j]) {
        if (date === "_id" || date === "author") continue;
        count += winnerList[j][date].totalCount;
        console.log(count);
      }
      winnerContributionArr.push(count);
      count = 0;
    }
    console.log(winnerContributionArr);
  } catch (e) {
    console.log("There was an error in connecting to mongo");
    console.error(e);
  } finally {
    await client.close();
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100vh",
        backgroundImage: `url(${background.src})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Podium Component */}
      <div style={{ marginTop: "50px" }}>
        <Podium winners={podiumData} />
      </div>

      {/* Column for ranked users */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 242, 255, 0.65), rgba(255, 0, 242, 0.65))",
          margin: "0 auto",
          display: "inline-block",
          flex: 1,
          fontSize: "40px",
          borderRadius: "10px",
          padding: "20px",
          overflow: "scroll",
          maxWidth: "600px",
          boxSizing: "border-box",
          marginTop: "50px",
        }}
      >
        <ul>
          {allUsersRanked.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: "40px",
                backgroundColor: "rgba(255, 255, 255, 1)",
                opacity: "0.6",
                borderRadius: "7px",
                margin: "10px",
              }}
            >
              {i + 1}. {item}
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
}
