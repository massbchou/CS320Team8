import top_users_algo from "../most-active-users/top_users";
import { MongoClient } from "mongodb";
import Podium from "../Podium";
import BarGraph from "./BarGraph";
import LeaderBoard from "./LeaderBoard";
import { Young_Serif } from "next/font/google";
import { userInfo } from "os";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default async function Page() {
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  const firstDay = new Date("2022-09-13");
  const lastDay = new Date("2022-12-17");
  let podiumRanked;
  let podiumData;
  let firstNamesArr = [];
  let namesArr = [];
  let winnerCommentArr = [];
  let winnerPostArr = [];
  let allCommentArr = [];
  let allPostArr = [];
  let connectUserToScore = [];
  const graphCommentTitle = "Number of Comments Made by Top Contributors";
  const graphPostTitle = "Number of Posts Made by Top Contributors";
  try {
    await client.connect();
    let userCollection = client.db("users").collection("users");
    let usersData = userCollection.find();
    let podiumList = await usersData.toArray();

    podiumRanked = top_users_algo(podiumList, firstDay, lastDay);
    podiumData = podiumRanked
      .slice(0, 5)
      .map((name, position) => ({ name, position }));
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
    for (let i = 0; i < 5; i++) {
      firstNamesArr.push(
        podiumData[i].name.substring(0, podiumData[i].name.indexOf(" ")),
      );
    }

    let allContributionCollection = client.db("users").collection("users");
    let allUsersScores = allContributionCollection.find({});
    let allUsersList = await allUsersScores.toArray();

    let totalCount;
    let indivCommentCount = 0;
    let indivPostCount = 0;
    let totalIndivComments;
    let totalIndivPosts;
    for (let j = 0; j < allUsersList.length; j++) {
      totalCount = 0;
      totalIndivComments = 0;
      totalIndivPosts = 0;
      for (let date in allUsersList[j]) {
        if (date === "_id" || date === "author") continue;
        indivCommentCount = allUsersList[j][date].commentCount;
        indivPostCount = allUsersList[j][date].postCount;
        totalIndivComments += indivCommentCount;
        totalIndivPosts += indivPostCount;
        totalCount += indivCommentCount + 2 * indivPostCount;
      }
      connectUserToScore[j] = {
        userID: allUsersList[j].author.id,
        firstName: allUsersList[j].author.firstName,
        lastName: allUsersList[j].author.lastName,
        fullName:
          allUsersList[j].author.firstName +
          " " +
          allUsersList[j].author.lastName,
        rank: totalCount,
        numComments: totalIndivComments,
        numPosts: totalIndivPosts,
      };
    }
    connectUserToScore.sort((a, b) => b.rank - a.rank);
    connectUserToScore.forEach((userInfo, index) => {
      userInfo.rank = index + 1;
    });
    allPostArr = connectUserToScore.map((userInfo) => userInfo.numPosts);
    allCommentArr = connectUserToScore.map((userInfo) => userInfo.numComments);
    winnerCommentArr = allCommentArr.slice(0, 5);
    winnerPostArr = allPostArr.slice(0, 5);
  } catch (e) {
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
        height: "100vh",
        background:
          "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
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

      {/* Flex container for graphs, podium, and scrollable list */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          marginTop: "50px", // Adjust as needed
        }}
      >
        {/* Bar Graphs */}
        <div style={{ flex: "0 0 20%", fontFamily: youngSerif }}>
          <BarGraph
            namesArr={firstNamesArr}
            scoresArr={winnerPostArr}
            title={graphPostTitle}
            font={youngSerif}
          />
          <BarGraph
            namesArr={firstNamesArr}
            scoresArr={winnerCommentArr}
            title={graphCommentTitle}
            font={youngSerif}
          />
        </div>
        {/* Scrollable List using LeaderBoard component */}
        <div style={{ flex: "0 0 45%", fontFamily: youngSerif }}>
          <LeaderBoard connectUserToScore={connectUserToScore} />
        </div>
        {/* Podium */}
        <div
          style={{ flex: "0 0 20%", textAlign: "center", marginRight: "40px" }}
        >
          <Podium winners={podiumData} />
        </div>
      </div>
    </main>
  );
}
