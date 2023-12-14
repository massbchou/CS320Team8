import top_users_algo from "../most-active-users/top_users";
import { MongoClient } from "mongodb";
import Podium from "./Podium";
import BarGraph from "./BarGraph";
import LeaderBoard from "./LeaderBoard";
// import { Young_Serif } from "next/font/google";

// const youngSerif = Young_Serif({
//   subsets: ["latin"],
//   weight: "400",
// });

/**
 * Async function representing a page displaying a leaderboard, some graphs, and a podium
 * Retrieves and displays information about all users in the leaderboard including their name,
 * rank, number of posts made, and number of comments made.
 */
export default async function Page() {
  // MongoDB connection details
  const url =
    "mongodb+srv://team8s:rattigan320fa23@campuswire.x730pf7.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(url);
  // Define the date range for the semester
  const firstDay = new Date("2022-09-13");
  const lastDay = new Date("2022-12-17");
  // Initialize variables to hold data
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
    // Connect to MongoDB
    await client.connect();
    // Retrieve user data
    let userCollection = client.db("users").collection("users");
    let usersData = userCollection.find();
    let podiumList = await usersData.toArray();

    // Calculate and process top users within the date range
    podiumRanked = top_users_algo(podiumList, firstDay, lastDay);
    podiumData = podiumRanked
      .slice(0, 5)
      .map((name, position) => ({ name, position }));
    //get the full names of the 5 members who will go on the podium
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
    //get only the first names of the 5 members who will go on the podium
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
    //for all users calculate their rank, full name, number of posts, and number of comments
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
    //sort them by rank from lowest to highest
    connectUserToScore.sort((a, b) => b.rank - a.rank);
    //make it so instead of counting from 0 it counts from 1
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
    // Close MongoDB connection
    await client.close();
  }

  return (
    <main
      style={{
        width: "100vw",
        overflowX: "auto",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          marginTop: "30px",
        }}
      >
        {/* Bar Graphs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Ensure stacking elements vertically
            alignItems: "center", // Center items horizontally
            width: "100%",
            // fontFamily: youngSerif,
            fontSize: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row", // Ensure stacking elements vertically
              alignItems: "center", // Center items horizontally
            }}
          >
            <BarGraph
              namesArr={firstNamesArr}
              scoresArr={winnerPostArr}
              title={graphPostTitle}
              // font={youngSerif}
            />
            <div style={{ margin: "30px" }}></div>
            <BarGraph
              namesArr={firstNamesArr}
              scoresArr={winnerCommentArr}
              title={graphCommentTitle}
              // font={youngSerif}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: "40px" }}>Winners of the Semester</div>
            <Podium winners={podiumData} />
          </div>
        </div>
        <div style={{ margin: "30px" }}></div>
        {/* Scrollable List using LeaderBoard component */}
        <div style={{ flex: "0 0 50%" /* fontFamily: youngSerif */ }}>
          <LeaderBoard connectUserToScore={connectUserToScore} />
        </div>
      </div>
    </main>
  );
}
